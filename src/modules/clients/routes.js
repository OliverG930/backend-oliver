const express = require('express')
const router = express.Router()
const resposes = require('../../red/responses')
const controller = require('./controller')

router.get('/', async (_, res) => {
    const data = await controller.all()
    resposes.success(_, res, data, 200)
})

router.post('/', async (req, res, next) => {
    try {
        const data = await controller.create(req.body)
        resposes.success(req, res, data, 200)
    } catch (e) {
        next(e)
        //resposes.error(req, res, e.message, 500)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const data = await controller.get(req.params.id)
        resposes.success(req, res, data, 200)
    } catch (e) {
        next(e)
        //resposes.error(req, res, e.message, 500)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const data = await controller.remove(req.params.id)
        resposes.success(req, res, data.affectedRows, 200)
    } catch (e) {
        next(e)
        //resposes.error(req, res, e.message, 500)
    }
})

module.exports = router