
let userExist = async (req, res, next) => {
    // get the user from the database
    const user = await prisma.user.findUnique({
        where: {
            authid: req.oidc.user.sub
        }
    })

    if(!user){
        // create user
        const newUser = await prisma.user.create({
            data: {
                authid: req.oidc.user.sub,
            }
        })
    }

    next();
}

module.exports = { userExist }