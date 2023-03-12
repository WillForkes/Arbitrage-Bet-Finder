const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();
const Stripe = require('stripe');

let stripe
if(process.env.NODE_ENV == 'development') {
    stripe = Stripe(process.env.STRIPE_TEST_SECRET);
} else {
    stripe = Stripe(process.env.STRIPE_LIVE_SECRET);
}

const plans = {
    starter: {
        product: "prod_NVYfBet3viHe4o",
        price: "price_1MkXYIIHDYxT34IbkE19iCXo",
    },
    pro: {
        product: "prod_NVqC83Czr0Jdd8",
        price: "price_1MkoVfIHDYxT34Ib6l0gtszK"
    },
    plus: {
        product: "prod_NVqDJv7gq5PcDY",
        price: "price_1MkoWdIHDYxT34IbBmT9Sy8a"
    }
}

// * Get profile data
router.post('/create', checkUser, async (req, res) => {
    let user = req.user
    
    if(!req.body.plan){
        res.status(500).json({"error": "Error creating payment link. No plan supplied."})
    }

    const plan = req.body.plan
    const productid = plans[plan].product
    const priceid = plans[plan].price

    if(!productid || !priceid){
        res.status(500).json({"error": "Error creating payment link. Invalid plan selected."})
        return;
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: priceid,
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url: 'https://localhost:3000/subscription/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://localhost:3000/subscription/canceled',
    });

    const dbpayment = await prisma.subscription.create({
        data: {
            userId: user.authid,
            stripePaymentId: session.id,
            plan: plan,
            planExpiresAt: new Date() // * this gets updated after payment is successful
        }
    })

    if(!dbpayment){
        res.status(500).json({"error": "Error inserting payment into database!"})
        return;
    }

    res.json({
        "status":"ok",
        "data": {
            "url": session.url,
            "object": session
        }
    })
});


router.get("/portal", checkUser, async (req, res) => {
    let user = req.user
    
    // get subscriptions on user with status "active"
    const dbuser = await prisma.user.findUnique({
        where: {
            authid: user.authid
        },
        include: {
            subscription: {
                where: {
                    status: "active"
                }
            }
        }
    })

    if(!dbuser){
        res.status(500).json({"error": "Error getting user from database!"})
        return;
    }

    const sub = dbuser.subscription[0]
    const returnUrl = "http://localhost:3001/profile";
    const customerId = sub.stripeCustomerId;

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    res.json({
        "status": "ok", 
        "data": {
            "url": portalSession.url
        }
    })
})

// 1.) Create a new checkout session
// 2.) Insert payment into database
// 3.) Return session url to pay back to client
// 4.) Once payment session is complete (does not necessarily mean paid) - update payment ids in database
// 5.) Once invoice payment is successful - activate sub an set expiry date

router.post("/webhook", async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = "whsec_9232b0a6659c8d62de3b9c29694164960bb9a43fdb23e21bb154e8d80da52631";
    let event;
  
    try {
        event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`)
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    data = event.data;
    eventType = event.type;

    switch (eventType) {
        case 'checkout.session.completed':
            // * You should provision the subscription and save the customer ID to your database
            const csc_stripePaymentId = data.object.id
            const csc_subId = data.object.subscription
            const csc_customerId = data.object.customer

            await prisma.subscription.update({
                where: {
                    stripePaymentId: csc_stripePaymentId
                },
                data: {
                    stripeSubscriptionId: csc_subId,
                    stripeCustomerId: csc_customerId,
                }
            })

            console.log("Payment successful!")
            break;
        case 'invoice.paid':
            const ip_subId = data.object.subscription
            const ip_invoiceId = data.object.id
            const ip_invoicePDF = data.object.invoice_pdf

            // * Create invoice in database
            await prisma.invoice.create({
                data: {
                    stripeInvoiceId: ip_invoiceId,
                    stripeSubscriptionId: ip_subId,
                    stripeInvoicePdfUrl: ip_invoicePDF,
                    status: eventType
                }
            })

            // * Update subscription status
            await prisma.subscription.update({
                where: {
                    stripeSubscriptionId: ip_subId
                },
                data: {
                    status: "active",
                    planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // * 30 days from now
                }
            })

            console.log("Invoice paid! Subscription activated!")
            break;
        case 'invoice.payment_failed':
            // * Remove subscription
            const ipf_subId = data.object.subscription

            await prisma.subscription.update({
                where: {
                    stripeSubscriptionId: ipf_subId
                },
                data: {
                    status: "inactive",
                }
            })

            break;
        default:
            // Unhandled event type
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.status(200)
});

module.exports = router;
