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
        cb(null, './uploads')
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
    console.log(req)
    const aula_id = params.aula
    const leccion_id = params.leccion
    const user_id = user.usuario_id

    const data = {
        file: file,
        user_id: user_id,
        aula_id: aula_id,
        leccion_id: leccion_id
    }

    await controller.saveFileOnDB(data)

    return resposes.success(req, res, { message: "Successfully uploaded files" }, 200)
})


//esta ruta se encarga de entregar el archivo desde el servidor al usuario, security se encarga de que solo de archivos
//a los usuarios autenticados
router.get("/download/:fileID", security(), async (req, res) => {
    const { params } = req
    const fileID = params.fileID
    const result = await controller.getFileFromDB(fileID)
    res.download(result[0].ruta_archivo)
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