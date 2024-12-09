/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const controller = require('./controller')
const multer = require('multer')

const fs = require('fs')
const pdf = require('pdf-parse')
const path = require('node:path')

const db = require('../../../DB/crud')

const TABLES = require('../../../utils/tables')
const security = require('../../../middlewares/security')

const OpenAI = require('openai')

const openai = new OpenAI({ apiKey: process.env.API_KEY })

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads') // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`) // Unique filename
  }
})

// Multer file filter for PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true) // Accept PDF files
  } else {
    cb(new Error('Only PDF files are allowed'), false) // Reject other files
  }
}

const upload = multer({ storage, fileFilter })

router.get('/:id', async (request, response) => {
  responses.success(request, response, { message: 'hello' }, 200)
})

router.get('/add/:id', async (request, response) => {
  const { id } = request.params

  const { insertId } = await controller.addNewTask(id)

  responses.success(request, response, { message: 'hello', insertId }, 200)
})

router.post('/add/:id', async (request, response) => {
  const { id } = request.params
  const { insertId } = await controller.addNewTask(id)
  responses.success(request, response, { insertId }, 200)
})

router.get('/content/:id', security(), async (req, res) => {
  const { id } = req.params

  // return responses.success(req, res, { message: 'tasks saved!' }, 200)
  try {
    const tasks = await db.selectOneWhere(TABLES.TASKS_CONTENT, { tarea: id })

    return responses.success(req, res, tasks, 200)
  } catch (error) {
    console.error(error.message)
    return responses.error(req, res, { message: 'content not found!' }, 404)
  }
})

router.post('/content', security(), async (req, res) => {
  const { tasks, task } = req.body
  const data = {
    tarea: task,
    value: JSON.stringify(tasks)
  }
  // return responses.success(req, res, { message: 'tasks saved!' }, 200)
  try {
    const result = await db.insert(TABLES.TASKS_CONTENT, data)
    return responses.success(req, res, { message: 'tasks saved!' }, 201)
  } catch (error) {
    console.error(error.message)
    return responses.error(req, res, { message: 'tasks not saved!' }, 201)
  }
})

router.patch('/content', security(), async (req, res) => {
  const { task, tasks } = req.body

  // return responses.success(req, res, { message: 'tasks saved!' }, 200)
  try {
    const update = await db.update(TABLES.TASKS_CONTENT, { value: JSON.stringify(tasks) }, { tarea: task })
    return responses.success(req, res, update, 200)
  } catch (error) {
    console.error(error.message)
    return responses.error(req, res, { message: 'content not found!' }, 404)
  }
})

router.post('/content/generate', security(), async (req, res) => {
  const { task, type, text, amount } = req.body

  if (!type) return responses.error(req, res, {}, 404)
  if (!text) return responses.error(req, res, {}, 404)
  if (!task) return responses.error(req, res, {}, 404)
  if (!amount) return responses.error(req, res, {}, 404)

  const level = 1

  const message = `
  Genera ${amount} preguntas en formato JSON para una tarea de inglés de nivel ${level}, con un total de ${1} preguntas. seguir los criterios detallados a continuación.

  **Instrucciones Generales para la Creación de Preguntas:**
  1. **Formato de Preguntas:**
      - Cada pregunta debe tener entre 3 y 4 opciones de respuesta si el tipo lo permite (por ejemplo, multiple_choice).
      - Solo una de las respuestas debe ser correcta.
      - La pregunta debe estar en Inglés, salvo que necesite ser en Español (e.g., para evaluar vocabulario o gramática específicos).
      - Las respuestas incorrectas deben ser plausibles y adecuadas para el nivel ${level} para evitar que la respuesta correcta sea obvia.

  2. **Cobertura y Temática de la tarea:**
      - Asegúrate de cubrir aspectos clave para evaluar una comprensión general y precisa de este contenido.

  3. **Estructura JSON de Cada Pregunta:**
      - Usa el formato JSON específico para el tipo de pregunta solicitado (${type}) y genera solo preguntas de este tipo.
      - El campo "correct" debe contener el índice (empezando desde 0) de la respuesta correcta, o el valor correcto en preguntas de tipo "typing".
      - El campo "points" debe indicar los puntos asignados a cada pregunta (generalmente entre 1 y 2, en función de la dificultad).

  4. **Ejemplos de Formato para Cada Tipo de Pregunta:**
     
     - **Tipo: multiple_choice**
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

  5. **Formato del JSON Final de la tarea:**
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
  - Usa únicamente el tipo de pregunta especificado: ${type}.
  - Asegúrate de que todas las preguntas, respuestas y puntuación sigan las especificaciones indicadas.
  - Solo devuelve el JSON final generado, sin información adicional.
  - que sean preguntas relevantes para una tarea de ingles.
  - utiliza este texto para generar las preguntas: ${text}

`

  if (message.length > 2999) {
    message.slice(0, 2999)
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful English teacher designed to produce JSON.'
      },
      {
        role: 'user', content: message
      }
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' }
  })

  return responses.success(req, res, JSON.parse(completion.choices[0].message.content), 201)
})

router.get('/content/file/:task', security(), async (req, res) => {
  const { task } = req.params
  const files = await db.select(TABLES.FILES, { task })

  return responses.success(req, res, files, 201)
})

router.post('/content/file', security(), upload.single('file'), async (req, res) => {
  const { usuario_id: user_id } = req.user
  const { room, task } = req.body

  try {
    // Read and parse PDF content
    const dataBuffer = fs.readFileSync(req.file?.path)
    const pdfData = await pdf(dataBuffer)
    const pdfText = pdfData.text
    const cleanedData = pdfText
      .replace(/[✓●©]/g, '') // Eliminar caracteres específicos como ✓ y ●
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por un solo espacio
      .replace(/^\s+|\s+$/gm, '')

    // Crear y escribir en el archivo
    fs.writeFile(`src/public/uploads/${req.file.filename}.txt`, cleanedData, async (err) => {
      if (err) {
        console.error(err.message)
        return responses.error(req, res, { message: 'ocurrió un error inesperado' }, 500)
      }

      const myData = {
        name: req.file.filename,
        tipo_archivo: req.file.mimetype,
        ruta_archivo: req.file.filename,
        user_id,
        task,
        aula_id: room,
        view_in_files: false
      }

      const saveFile = await db.insert(TABLES.FILES, myData)
      return responses.success(req, res, { message: 'upload complete!', myData, insertId: saveFile.insertId }, 200)
    })
  } catch (err) {
    return responses.error(req, res, { message: 'ocurrió un error inesperado' }, 500)
  }
})

router.delete('/content/file', security(), async (req, res, next) => {
  const { archivo_id } = req.body
  fs.rm(path.join('./src/public/uploads/', '1733616722022-CTY4_Energizer_Worksheets_Unit_6.pdf.txt'), { recursive: false }, (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Recursive: Directory Deleted!')

      // List files after delete
    }
  })
  next()
})

module.exports = router
