const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();

/* GET users listing. */
router.get('/update', async function(req, res, next) {
  // update user data

  const userData = {

  }

  await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: userData
    }).then((data) => {
        res.status(200).json(data)
    }
    ).catch((err) => {
        res.status(500).json({"error": "Failed to update user data.", "details": err});
        console.log(err)
    })
});

module.exports = router;
