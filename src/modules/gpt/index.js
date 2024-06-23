const express = require('express')
const router = express.Router()
const resposes = require('../../red/responses')
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: "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" });

router.post('/resume', async (req, res) => {
    const { body } = req
    const messageRes = `haz un resumen rápido del nivel de un estudiante de ingles al que se le dieron unos ejercicios de ingles para detectar su nivel a continuación te envió el objeto: "${JSON.stringify(body)}". Sigue los siguientes puntos, donde isCorrectUserAnswer es si acerto la pregunta, title question es la pregunta.
1. solo responde un json.
2. el formato del json debe ser asi: totalRespuestas, respuestasCorrectas, respuestasInorrectas,porcentajeAciertos, nivelIngles, observaciones.
3. responde en segunda persona
4. recuerda 'isCorrectUserAnswer' determina si es correcta o no la respuesta.
5. que las observaciones esten bien explicadas o 10 0 20 palabras`

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful teacher designed to output JSON.",
            },
            {
                role: "user", content: messageRes
            },
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    })

    resposes.success(req, res, { res: JSON.parse(completion.choices[0].message.content) }, 200)
})


router.post('/recomendations', async (req, res) => {
    const { body } = req
    const messageRes = `
crea unas 3 recomendaciones para un estudiante de ingles al que se le dieron unos ejercicios de ingles.
1. solo responde un json, no agregues ejercicios ni nada mas
2. responde en segunda persona.
3. solo responde las recomendaciones en formato JSON.
4. el formato del json de la recomendacion debe tener: estrategia, descripcion.
4 el key recomendacion debe englobar a las estratejais asi recomendacion:[{estrategia:'', descripcion:''}...]
este es el resumen para generar las recomendaciones:

${JSON.stringify(body)}
`

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful teacher designed to output JSON.",
            },
            {
                role: "user", content: messageRes
            },
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    })

    console.log(messageRes)

    resposes.success(req, res, { res: JSON.parse(completion.choices[0].message.content) }, 200)
})


router.post('/generate/:ammount', async (req, res) => {
    const { body, params } = req

    const cantidad = parseInt(params.ammount) || 10


    const messageRes = `crea ${cantidad} ejercicios para afianzar el aprendisaje del ingles, siguiendo los siguientes puntos
1. Responde solo el JSON nada mas.
2. responde solo los ejercicios.
3. en cada ejercicio agrega 3 opciones.
4. el formato de los ejercicios debe tener: title, question, options, answer.
5. el title y question deben estar en espanol.
6. en cada ejercicio agrega el ejercicio correcto segun el indice de las opciones.
7. no olvides que el anser debe se el indice de la options correcta.

estoso son los datos del ultimo test de ingles de este alumno:

${body}

`

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful teacher designed to output JSON.",
            },
            {
                role: "user", content: messageRes
            },
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    })

    resposes.success(req, res, { res: JSON.parse(completion.choices[0].message.content) }, 200)
})

const sleep = ms => new Promise(r => setTimeout(r, ms))

router.get('/test-connect', async (req, res) => {
    await sleep(5000)

    resposes.success(req, res, { message: 'hola mundo' }, 200)
})

module.exports = router