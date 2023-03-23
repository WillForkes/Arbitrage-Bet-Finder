const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { requiresAuth } = require('express-openid-connect');

let checkStaff = async (req, res, next) => {
    // ! check if user is authenticated
    const isAuthenticated = req.oidc.isAuthenticated()

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
        res.status(500).json({"error": "User not found"})
        return;
    }

    // ! If user is not staff
    if(user.staff == false){
        res.status(401).json({"error": "User is not staff"})
        return;
    }

    next();
}

module.exports = { checkStaff }