const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();

// * Update whitelisted bookies
router.post('/create', checkUser, async function(req, res, next) {
   
});

module.exports = router;
