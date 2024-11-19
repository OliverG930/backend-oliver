const express = require('express')
const router = express.Router()
const messages = require('../../../../utils/messages')
const controller = require("./controller")
const security = require('../../../../middlewares/security')
const IsTeacher = require("../../../../middlewares/teacher")
const responses = require('../../../../red/responses')

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.API_KEY });

router.get('/all/:lesson', security(), IsTeacher(), async (req, res) => {
  const lesson = req.params.lesson

  await controller.all(lesson)
    .then(result => {
      responses.success(req, res, { message: messages.info_messages.ALL_LESSONS_CONTENTS, result }, 200)
    }).catch((e) => {
      responses.error(req, res, { message: e.message, e }, 200)
    })
})

router.post('/create/:lesson', security(), IsTeacher(), async (req, res) => {

  const { body, params } = req
  const lesson = params.lesson

  const data = {
    lesson_id: lesson,
    type: body?.type,
    value: body?.value
  }

  await controller.create(data)
    .then(result => {
      responses.success(req, res, { message: messages.info_messages.LESSONS_CONTENTS_CREATED, result }, 200)
    }).catch((e) => {
      responses.error(req, res, { message: e.message, e }, 200)
    })
})

router.delete('/delete/:content', security(), IsTeacher(), async (req, res) => {

  const { params } = req
  const content = params.content

  await controller.remove(content)
    .then(result => {
      responses.success(req, res, { message: messages.info_messages.LESSONS_CONTENTS_DELETED, result }, 200)
    }).catch((e) => {
      responses.error(req, res, { message: e.message, e }, 200)
    })
})

router.post('/generate', async (req, res) => {
  const { body } = req

  const message = `Genera un conjunto de preguntas en formato JSON para un lección de gramática inglés, con un total de una preguntas. Todas deben estar enfocadas en el tema "${body.prompt}" y seguir los criterios detallados a continuación.

  ** Instrucciones Generales para la Creación de Preguntas:**
    1. ** Formato de Preguntas:**
      - Cada pregunta debe tener entre 3 y 4 opciones de respuesta si el tipo lo permite(por ejemplo, multiple_choice).
      - Solo una de las respuestas debe ser correcta.
      - La pregunta debe estar en inglés
      - Las respuestas incorrectas deben ser adecuadas para evitar que la respuesta correcta sea obvia.

  2. ** Cobertura y Temática del Examen:**
    - Asegúrate de cubrir aspectos clave del tema "${body.prompt}" para evaluar una comprensión general y precisa de este contenido.

  3. ** Estructura JSON de Cada Pregunta:**
    - Usa el formato JSON específico para el tipo de pregunta solicitado(${body.type}) y genera solo preguntas de este tipo.
      - El campo "correct" debe contener el índice(empezando desde 0) de la respuesta correcta, o el valor correcto en preguntas de tipo "typing".
      - El campo "points" debe indicar los puntos asignados a cada pregunta(generalmente entre 1 y 2, en función de la dificultad).

  4. ** Ejemplos de Formato para Cada Tipo de Pregunta:**
     
     - ** Tipo: multiple_choice **
  \`\`\`json
       {
         "ask": "Escribe aquí una pregunta clara y directa.",
         "answers": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
         "correct": [índice de la respuesta correcta],
         "type": "multiple_choice",
         "points": [valor numérico de los puntos]
       }
       \`\`\`

     - **Tipo: true_false**
       \`\`\`json
       {
         "ask": "Escribe aquí una pregunta de verdadero o falso.",
         "answers": ["Verdadero", "Falso"],
         "correct": [índice de la respuesta correcta],
         "type": "true_false",
         "points": [valor numérico de los puntos]
       }
       \`\`\`

     - **Tipo: typing**
       \`\`\`json
       {
         "ask": "Escribe aquí la pregunta para que el estudiante proporcione la respuesta escrita.",
         "correct": "respuesta correcta esperada",
         "type": "typing",
         "points": [valor numérico de los puntos]
       }
       \`\`\`

  5. **Formato del JSON Final:**
     - Organiza las preguntas en un solo JSON, con todas incluidas en un arreglo bajo el campo "questions":
       \`\`\`json
       {
         "questions": [
           { /* pregunta 1 */ },
           { /* pregunta 2 */ },
           ...
         ]
       }
       \`\`\`

  **Instrucciones adicionales:**
  - Usa únicamente el tipo de pregunta especificado: ${body.type}.
  - Asegúrate de que todas las preguntas, respuestas y puntuación sigan las especificaciones indicadas.
  - Solo devuelve el JSON final generado, sin información adicional.
  - que sean preguntas relevantes para una lección de ingles.
  `

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


  return responses.success(req, res, JSON.parse(completion.choices[0].message.content), 200)
})

router.post('/save', async (req, res) => {

  const { body } = req

  const question = JSON.parse(body.value)


  const message = `
  Extrae 3 palabras claves según el contenido para el siguiente texto "${question.ask}" sea gramática o vocabulario solo responde un array con las palabras
  ejemplo: {
  "keywords": ["key1", "key2",...]
}
  
  
  `

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

  console.log()


  //return responses.success(req, res, {}, 200)
  await controller.create({ ...body, keyword: completion.choices[0].message.content })
    .then(result => {

      console.log(result)
      return responses.success(req, res, { message: messages.info_messages.LESSONS_CONTENTS_CREATED, result }, 200)

    }).catch((e) => {
      console.log(e)

      return responses.error(req, res, { message: e.message, e }, 200)
    })

})

module.exports = router