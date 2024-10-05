const express = require('express')
const router = express.Router()
const responses = require('../../red/responses')
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.API_KEY });

router.post('/resume', async (req, res) => {
    const { body } = req
    const messageRes = `haz un resumen rápido del nivel de un estudiante de ingles al que se le dieron unos ejercicios de ingles para detectar su nivel a continuación te envió el objeto: "${JSON.stringify(body)}". Sigue los siguientes puntos, donde isCorrectUserAnswer es si acerto la pregunta, title question es la pregunta.
1. solo responde un json.
2. el formato del json debe ser asi: totalRespuestas, respuestasCorrectas, respuestasIncorrectas,porcentajeAciertos, nivelIngles, observaciones.
3. responde en segunda persona
4. recuerda 'isCorrectUserAnswer' determina si es correcta o no la respuesta.
5. que las observaciones estén bien explicadas o 10 0 20 palabras`

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful English teacher designed to produce JSON.",
            },
            {
                role: "user", content: messageRes
            },
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    })

    responses.success(req, res, { res: JSON.parse(completion.choices[0].message.content) }, 200)
})


router.post('/recommendations', async (req, res) => {
    const { body } = req
    const messageRes = `
crea unas 3 recomendaciones para un estudiante de ingles al que se le dieron unos ejercicios de ingles.
1. solo responde un json, no agregues ejercicios ni nada mas
2. responde en segunda persona.
3. solo responde las recomendaciones en formato JSON.
4. el formato del json de la recomendación debe tener: estrategia, descripción.
4 el key recomendación debe englobar a las estrategias asi recomendación:[{estrategia:'', descripción:''}...]
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

    responses.success(req, res, { res: JSON.parse(completion.choices[0].message.content) }, 200)
})


router.post('/generate/:amount', async (req, res) => {
    const { body, params } = req

    const cantidad = parseInt(params.amount) || 10


    const messageRes = `crea ${cantidad} ejercicios para afianzar el aprendizaje del ingles, siguiendo los siguientes puntos
        1. Responde solo el JSON nada mas.
        2. responde solo los ejercicios.
        3. en cada ejercicio agrega 3 opciones.
        4. el formato de los ejercicios debe tener: title, question, options, answer.
        5. el title y question deben estar en espanol.
        6. en cada ejercicio agrega el ejercicio correcto según el indice de las opciones.
        7. no olvides que el answer debe se el indice de la options correcta.

        estos son los datos del ultimo test de ingles de este alumno:

        ${body}

        `;

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

    responses.success(req, res, { res: JSON.parse(completion.choices[0].message.content) }, 200)
})

router.post("/gen/exam", async (req, res) => {

    const { amount, level } = req.body;

    if (!amount) {
        responses.error(req, res, { message: "amount required" }, 500);
    }

    if (!level) {
        responses.error(req, res, { message: "level required" }, 500);
    }

    const message = `
    Genera un examen de inglés de nivel ${level} en formato JSON. El examen debe incluir ${amount} preguntas de selección múltiple, cada una con entre 3 y 4 opciones de respuesta. Asegúrate de lo siguiente:
    Las preguntas deben ser sobre temas básicos de gramática y vocabulario en inglés (como verbos, preposiciones, preguntas comunes, etc.).
    Cada pregunta debe tener una única respuesta correcta.
    El formato debe ser el siguiente:
    json
    Copiar código
    {
        "asks": [
            {
                "ask": "Escribe aquí la pregunta, solo la pregunta y nada mas.",
                "answers": ["Opción 1", "Opción 2", "Opción 3"],
                "correct": [índice de la respuesta correcta],
                "type": "multiple_choice",
                "points": [número de puntos para esta pregunta]
            }
        ]
    }
    El campo 'correct' debe ser el índice (empezando desde 0) de la respuesta correcta.
    El campo 'points' debe indicar la cantidad de puntos que vale cada pregunta.
    Asegúrate de que las preguntas sean adecuadas para a1 y cubran gramática y vocabulario básicos."
        `;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful English teacher designed to produce JSON.",
            },
            {
                role: "user", content: message
            },
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    })


    responses.success(req, res, JSON.parse(completion.choices[0].message.content), 200);

});

module.exports = router