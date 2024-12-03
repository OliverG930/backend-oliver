/*
const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const security = require('../../../middlewares/security')

router.get("/", security(), (req, res) => {
    return responses.success(req, res, { message: "success" }, 200)
})

module.exports = router
*/
const express = require('express');
const router = express.Router();
const responses = require('../../../red/responses');
const security = require('../../../middlewares/security');
const { generateReport } = require('./reports');
const getAulasAndStudents = require('./getaulaestudiante');
router.get("/", security(), (req, res) => {
    return responses.success(req, res, { message: "success" }, 200);
});

// Nueva ruta para el reporte
router.get("/reporte", (req, res) => {
    generateReport(req, res);
});

// Define la ruta /rhelp y pasa la función como el manejador
router.get("/rhelp", getAulasAndStudents);




module.exports = router;
