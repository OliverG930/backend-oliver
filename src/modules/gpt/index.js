const express = require('express')
const router = express.Router()
const responses = require('../../red/responses')
const { writeFileSync } = require("node:fs")


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





router.post("/gen/exam", async (req, res) => {

    const { amount, level, title } = req.body;

    if (!amount) {
        responses.error(req, res, { message: "amount required" }, 500);
    }

    if (!level) {
        responses.error(req, res, { message: "level required" }, 500);
    }

    if (!title) {
        responses.error(req, res, { message: "title required" }, 500);
    }

    const message = `
    Genera un examen de inglés en formato JSON para el nivel ${level}, que debe ser A1, y debe estar relacionado con el tema "${title}". El examen debe incluir ${amount} preguntas de selección múltiple, siguiendo estos criterios:

  1. Cada pregunta debe tener entre 3 y 4 opciones de respuesta.
  2. Solo una respuesta es correcta por pregunta.
  3. Las preguntas deben enfocarse en gramática y vocabulario básicos adecuados para el nivel ${level}.
  4. El examen debe cubrir aspectos esenciales del tema seleccionado.
  5. El campo 'correct' debe ser el índice (empezando desde 0) de la respuesta correcta.
  6. El campo 'points' debe especificar la cantidad de puntos que vale cada pregunta.
  7. El campo de ask debería ser en español a no ser que necesite ser en ingles.


  El formato JSON debe seguir esta estructura:

  {
    "asks": [
      {
        "ask": "Escribe aquí la pregunta, de forma clara y directa.",
        "answers": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
        "correct": [índice de la respuesta correcta],
        "type": "multiple_choice",
        "points": [valor numérico de los puntos]
      },
      {
        "ask": "Escribe aquí otra pregunta.",
        "answers": ["Opción 1", "Opción 2", "Opción 3"],
        "correct": [índice de la respuesta correcta],
        "type": "multiple_choice",
        "points": [valor numérico de los puntos]
      },
    {
        "ask": "Escribe aquí otra pregunta.",
        "answers": [
            "Verdadero",
            "Falso"
        ],
        "correct":[índice de la respuesta correcta],
        "type": "true_false",
        "points": [valor numérico de los puntos]
    },
    ]
  }

  Asegúrate de que:
  - Las preguntas sean adecuadas para el nivel ${level}.
  - Los puntos estén bien distribuidos y reflejen la dificultad de la pregunta (generalmente 1-2 puntos).
  - Las respuestas incorrectas tengan sentido y sean razonablemente plausibles para evitar que las respuestas correctas sean demasiado obvias.

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


router.post("/generate/exam", async (req, res) => {

    const { amount, level, title, type } = req.body;


    if (!amount) {
        return responses.error(req, res, { message: "amount required" }, 500);
    }

    if (!level) {
        return responses.error(req, res, { message: "level required" }, 500);
    }

    if (!title) {
        return responses.error(req, res, { message: "title required" }, 500);
    }

    if (!type) {
        return responses.error(req, res, { message: "type required" }, 500);
    }

    const message = `
    Genera ${amount} preguntas para un examen de inglés en formato JSON para el nivel ${level}, que debe ser A1, y debe estar relacionado con el tema "${title}". El examen debe incluir ${amount} preguntas de tipo ${type}, siguiendo estos criterios:

  1. Cada pregunta debe tener entre 3 y 4 opciones de respuesta.
  2. Solo una respuesta es correcta por pregunta.
  3. Las preguntas deben enfocarse en gramática y vocabulario básicos adecuados para el nivel ${level}.
  4. El examen debe cubrir aspectos esenciales del tema seleccionado.
  5. El campo 'correct' debe ser el índice (empezando desde 0) de la respuesta correcta.
  6. El campo 'points' debe especificar la cantidad de puntos que vale cada pregunta.
  7. El campo de ask debería ser en español a no ser que necesite ser en ingles.


  estos son los formatos de los distintos tipos para que agregues según la cantidad de preguntas en este caso "${amount}"

    Tipo : multiple_choice
      {
        "ask": "Escribe aquí la pregunta, de forma clara y directa.",
        "answers": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
        "correct": [índice de la respuesta correcta],
        "type": "multiple_choice",
        "points": [valor numérico de los puntos]
      }

    Tipo : true_false
      {
        "ask": "Escribe aquí otra pregunta.",
        "answers": [
            "Verdadero",
            "Falso"
        ],
        "correct":[índice de la respuesta correcta],
        "type": "true_false",
        "points": [valor numérico de los puntos]
    }

    Tipo : true_false
      {
        "ask": "Escribe aquí otra pregunta.",
        "answers": [
            "Verdadero",
            "Falso"
        ],
        "correct":[índice de la respuesta correcta],
        "type": "true_false",
        "points": [valor numérico de los puntos]
    }

    Tipo : typing
    {
        "ask": "Escribe la pregunta.",
        "correct": [valor correcto],
        "type": "typing",
        "points": [valor numérico de los puntos]
    }


    formato del JSON
    {"questions": [aquí las preguntas generadas]}
    

  Asegúrate de que:
  - Las preguntas sean adecuadas para el nivel ${level}.
  - Los puntos estén bien distribuidos y reflejen la dificultad de la pregunta (generalmente 1-2 puntos).
  - Las respuestas incorrectas tengan sentido y sean razonablemente plausibles para evitar que las respuestas correctas sean demasiado obvias.
  -solo devuelve la pregunta según el tipo: ${type} listado en el json anterior

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


router.post("/gen/audio", async (req, res) => {
    // Generate an audio response to the given prompt
    const response = await openai.chat.completions.create({
        model: "gpt-4o-audio-preview",
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "mp3" },
        messages: [
            {
                role: "user",
                content: "La capital de Australia?"
            }
        ]
    });

    // Write audio data to a file
    writeFileSync(
        "dog.wav",
        Buffer.from(response.choices[0].message.audio.data, 'base64'),
        { encoding: "utf-8" }
    );

    responses.success(req, res, response.choices[0].message.audio.transcript, 200);
})

router.post("/exam/analice", async (req, res) => {


    const { body } = req

    const examen = body

    const messageRes = `

    1. analiza el siguiente json y asigna los points especificados de cada respuesta correcta y responde un json con el siguiente contenido.
    {
        totalPointsCorrect: ,
        recommendations ,
        totalPoints ,
        percentage
    }

    2. estas son las respuestas del examen: ${JSON.stringify(examen)}

    3. solo responde un json
    4. la recommendations deben estar en español, se lo mas breve posible.
    5. totalPoints es el total de la suma de los puntos correctos e incorrectos
    6. añade también un porcentaje de las respuestas correctas según el total!

    `
    console.log(JSON.stringify(examen))

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

    // console.log(JSON.stringify(examen))
    responses.success(req, res, { res: completion.choices[0].message.content }, 200)
})

module.exports = router