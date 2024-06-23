const express = require('express')
const router = express.Router()
const resposes = require('../../red/responses')
const auth = require("../../auth")


function security() {

    const middleware = (req, res, next) => {
        auth.checkToken.confirmToken(req)
        next()
    }

    return middleware

}

router.get("/", security(), (req, res) => {
    console.log('hello')
})

module.exports = router