const express = require("express")
const router = express.Router()
const responses = require("../../red/responses")
const controller = require("./controller")
const multer = require("multer")
const path = require("node:path")
const fs = require("fs");
const security = require("../../middlewares/security")

// Configuración de multer
const storage = multer.diskStorage({
  destination: process.cwd() + "/src/public/uploads",
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`
    cb(null, uniqueSuffix)
  },
})

const upload = multer({ storage })

router.put("/image", security(), upload.single('image'), async (req, res) => {
  const image = req.file ? req.file.filename : null;
  const { usuario_id } = req.user

  if (!image) {
    return responses.error(req, res, { message: "No image uploaded" }, 400)
  }

  try {
    // Obtener la imagen actual del usuario
    const { userimage } = await controller.getUserImageById(usuario_id)


    if (userimage) {
      const imagePath = path.resolve(`./src/public/uploads/${userimage}`)

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath) // Eliminar la imagen anterior
      }
    }

    //// Guardar o actualizar la nueva imagen
    await controller.updateUserImageById(usuario_id, image)

    return responses.success(req, res, { message: "User profile image updated successfully" }, 200)
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500)
  }
})

// Exportar el router
module.exports = router
