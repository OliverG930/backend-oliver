const express = require('express')
const router = express.Router()
const seguridad = require('../seguridad')
const security = require("../../../middlewares/security")
const responses = require('../../../red/responses')
const { updateLesson, createLesson, deleteLesson, geteLesson, getAllLessons, getLesssonFiles, getLesson } = require('../controllers/lessons')

const { ROLES } = require("../../../utils/roles")


//consulta todas las entradas de la db
router.get('/:id/all', seguridad(), async (req, res, next) => {

    const room_id = req.params.id

    const all = await getAllLessons(room_id)

    return responses.success(req, res, all, 200)

})

router.get('/:id', seguridad(), async (req, res, next) => {

    const id = req.params.id

    const respuesta = await getLesson(id)

    return responses.success(req, res, { respuesta }, 200)

})

router.post('/create/:aula', seguridad(), async (req, res) => {

    const user = req.user
    const aula = req.params.aula

    if (!user) {
        return responses.error(req, res, { message: "no user detected!" }, 500)
    }

    if (user.rol_id !== ROLES.TEACHER) {
        return responses.error(req, res, { message: "no teacher USER" }, 500)
    }

    const create_lesson = await createLesson(aula, user.usuario_id).catch((e) => {
        return responses.error(req, res, { message: "no se pudo insertar" }, 500)
    })

    return responses.success(req, res, { message: "lesson created!", ...create_lesson }, 200)

})


router.post("/update/:lesson", seguridad(), async (req, res) => {
    const body = req.body
    const lesson_id = req.params.lesson

    const data = {
        "tipo_leccion": body.tipo_leccion,
        "descripcion": body.descripcion,
        "fecha_limite": new Date(body.fecha_limite)
    }

    const lesson_updated = updateLesson(lesson_id, data).catch((e) => console.log(e.message))

    return responses.success(req, res, { message: "updated!", lesson_updated }, 200)

})


router.delete("/delete/:lessonId", security(), async (req, res) => {


    const { params, user } = req
    const { lessonId } = params
    const { usuario_id } = user

    await getLesson(lessonId).then(result => {

        if (usuario_id === result.user_id) {
            deleteLesson(lessonId).catch(({ message }) => {
                return responses.error(req, res, { message: message }, 500)
            })
        } else {
            return responses.error(req, res, { message: "no permissions!" }, 500)
        }

    }).catch(({ message }) => {
        return responses.error(req, res, { message: message }, 500)
    })

    return responses.success(req, res, { message: "deleted!" }, 200)

})

router.get('/files/:lesson_id/all', seguridad(), async (req, res, next) => {

    const lesson_id = req.params.lesson_id

    const all = await getLesssonFiles(lesson_id)

    return responses.success(req, res, all, 200)

})


module.exports = router