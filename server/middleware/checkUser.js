const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { requiresAuth } = require('express-openid-connect');

let checkUser = async (req, res, next) => {
    // check if user is authenticated
    const isAuthenticated = req.oidc.isAuthenticated()

    // check if api key is provided - therefore doesnt need to be logged in
    if(req.query.apikey && !isAuthenticated){
        const userByApi = await prisma.user.findUnique({
            where: {
                apiKey: req.query.apikey
            }
        })
        if(!userByApi){
            res.status(401).json({"error": "Invalid api key"})
            return;
        }
        req.user = userByApi
        
        next();
        return;
    }

    // ! If no api key and is not authenticated
    if(!isAuthenticated){
        res.status(401).json({"error": "User is not authenticated"})
        return;
    }

    // ! Get user data from local db
    let user = await prisma.user.findUnique({
        where: {
            authid: req.oidc.user.sub
        },
        include: {
            subscription: {
                where: {
                    status: "active"
                }
            }
        }  
    })

    // ! If no user, create user
    if(!user){
        // create user
        // generate api key
        const apikey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const newUser = await prisma.user.create({
            data: {
                authid: req.oidc.user.sub,
                apikey: apikey
            }
        })

        if(!newUser){
            res.status(500).json({"error": "Error creating user"})
            return;
        }
    }


    let plan = user.subscription[0] ? user.subscription[0].plan : "free"
    const planExpiresAt = user.subscription[0] ? new Date(user.subscription[0].planExpiresAt) : new Date()
    const planStripePaymentId = user.subscription[0] ? user.subscription[0].stripePaymentId : null

    // ! Check user plan has not expired
    if(plan != "free" && planExpiresAt < new Date()){
        // ! Update user plan to free and set subscription to inactive
        plan = "free"

        await prisma.subscription.update({
            where: {
                stripePaymentId: planStripePaymentId
            },
            data: {
                status: "inactive"
            }
        })
    }

    // ! attach user to request
    delete user.subscription
    user.plan = plan
    user.planExpiresAt = planExpiresAt
    req.user = user

    next();
}

module.exports = { checkUser }