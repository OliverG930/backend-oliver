const express = require('express')
const router = express.Router()
const resposes = require('../../red/responses')
const controller = require("./controller")
const multer = require("multer")
const security = require('../../middlewares/security')
//Multer es un "middleware" de node.js para el manejo de multipart/form-data, el cuál es usado sobre todo para la subida de archivos. Está escrito sobre busboy para maximizar su eficiencia.
//https://github.com/expressjs/multer/blob/master/doc/README-es.md

//configuracion de multer para subir en la carpeta de uploads los archivos
//filename: guarda el archivo con el nombre original pero antes agrega un suffix unico
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        const name = `${uniqueSuffix}-${file.originalname}`;
        cb(null, name);
    }
})

const upload = multer({ storage: storage })

router.post("/upload/:aula/:leccion", security(), upload.single("file"), async (req, res) => {

    const { file, user, params } = req
    const aula_id = params.aula
    const leccion_id = params.leccion
    const user_id = user.usuario_id

    if (!aula_id) { resposes.error(req, res, { message: "No aula id" }, 500) }
    if (!leccion_id) { resposes.error(req, res, { message: "No leccion id" }, 500) }

    const data = {
        file: file,
        user_id: user_id,
        aula_id: aula_id,
        leccion_id: leccion_id
    }

    try {
        await controller.save(data).then(result => {
            return resposes.success(req, res, { message: "Successfully uploaded files", insertId: result.insertId }, 200)
        })
    } catch (e) {
        console.log(e.message)
        return
    }
})

router.post("/upload/:aula", security(), upload.single("file"), async (req, res) => {

    const { file, user, params } = req
    const aula_id = params.aula
    const user_id = user.usuario_id

    if (!aula_id) { resposes.error(req, res, { message: "No aula id" }, 500) }

    const data = {
        file: file,
        user_id: user_id,
        aula_id: aula_id
    }

    try {
        await controller.save(data).then(result => {
            return resposes.success(req, res, { message: "Successfully uploaded files", insertId: result.insertId }, 200)
        })
    } catch (e) {
        console.log(e.message)
        return
    }
})

router.get("/get/:aula", security(), async (req, res) => {

    const { user, params } = req
    const aula_id = params.aula
    const user_id = user.usuario_id

    if (!aula_id) { resposes.error(req, res, { message: "No aula id" }, 500) }

    try {
        await controller.getFileWithRoomId(aula_id).then(result => {

            console.log(result)
            return resposes.success(req, res, { files: result }, 200)
        })
    } catch (e) {
        console.log(e.message)
        return
    }
})

router.post("/upload/audio/:aula/:leccion", security(), upload.any("file"), async (req, res) => {

    const { files, user, params } = req
    const aula_id = params.aula
    const leccion_id = params.leccion
    const user_id = user.usuario_id

    if (!aula_id) { resposes.error(req, res, { message: "No aula id" }, 500) }
    if (!leccion_id) { resposes.error(req, res, { message: "No leccion id" }, 500) }

    const data = {
        file: files[0],
        user_id: user_id,
        aula_id: aula_id,
        leccion_id: leccion_id
    }

    try {
        const result = await controller.save(data)

        resposes.success(req, res, { result, data }, 200)
    } catch (e) {
        console.log(e.message)
        return
    }
})

//esta ruta se encarga de entregar el archivo desde el servidor al usuario, security se encarga de que solo de archivos
//a los usuarios autenticados
router.get("/download/:fileID", security(), async (req, res) => {
    const { params } = req
    const fileID = params.fileID
    const result = await controller.getFileFromDB(fileID)
    res.download(result[0].ruta_archivo)
})

router.get("/:fileID", async (req, res) => {
    const { params } = req
    const fileID = params.fileID
    const result = await controller.getFileFromDB(fileID)

    resposes.success(req, res, result, 200)
    //res.download(result[0].ruta_archivo)
})


//borramos el archivo de la bd
router.get("/delete/:fileID", security(), async (req, res) => {
    const { params, user } = req
    const fileID = params.fileID
    const user_id = user.usuario_id


    await controller.getFileFromDB(fileID).then(result => {

        if (result[0].user_id === user_id) {
            console.log('borrando...')
            controller.deleteFileFromDB(fileID).then(result => {
                console.log(result)
            }).catch(({ message }) => console.log(message))
        } else {
            console.log('no coinciden')
        }
    })

    return resposes.success(req, res, { message: "success deleted!" }, 200)
})

module.exports = router