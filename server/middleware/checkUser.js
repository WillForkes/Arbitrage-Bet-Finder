const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { requiresAuth } = require('express-openid-connect');

let checkUser = async (req, res, next) => {
    // check if user is authenticated
    const isAuthenticated = req.oidc.isAuthenticated()

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
        const afilliateCode = makeid(8)

        const newUser = await prisma.user.create({
            data: {
                email: req.oidc.user.email,
                afilliateCode: afilliateCode,
                authid: req.oidc.user.sub,
                apikey: apikey
            }
        })

        if(!newUser){
            res.status(500).json({"error": "Error creating user"})
            return;
        }
        user = newUser
    }

    // ! Check user plan has not expired
    let plan
    let planExpiresAt
    let planId

    // ! Check if the user has a trial plan and disable that one since they have another active plan
    if(user.subscription.length == 2) {
        for(let i = 0; i < user.subscription.length; i++){
            if(user.subscription[i].plan == "trial"){
                await prisma.subscription.update({
                    where: {
                        id: user.subscription[i].id
                    },
                    data: {
                        status: "inactive"
                    }
                })
            }
        }
    }

    if(user.subscription?.length == 0 || user.subscription == null || user.subscription == {}){
        plan = "free"
        planExpiresAt = new Date()
        planId = null
    } else {
        plan = user.subscription[0].plan
        planExpiresAt = new Date(user.subscription[0].planExpiresAt)
        planId = user.subscription[0].id
    }

    if(plan != "free" && planExpiresAt < new Date()){
        // ! Update user plan to free and set subscription to inactive
        plan = "free"

        await prisma.subscription.update({
            where: {
                id: planId
            },
            data: {
                status: "inactive"
            }
        })
    }

    // ! attach user to request
    user.plan = plan
    user.planExpiresAt = planExpiresAt
    user.subId = user.subscription.subId
    delete user.subscription
    user.email = req.oidc.user.email

    // * attach user to request
    req.user = user

    next();
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

module.exports = { checkUser }