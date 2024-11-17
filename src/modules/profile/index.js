const express = require("express");
const router = express.Router();
const responses = require("../../red/responses");
const controller = require("./controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de multer
const storage = multer.diskStorage({
    destination: "./src/public/uploads",
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

router.put("/userimage/:id", upload.single("userimage"), async (req, res) => {
    const { id } = req.params; // ID del usuario
    const userimage = req.file ? req.file.filename : null;

    if (!userimage) {
        return responses.error(req, res, { message: "No image uploaded" }, 400);
    }

    try {
        // Obtener la imagen actual del usuario
        const currentImage = await controller.getUserImageById(id);
        if (currentImage) {
            const imagePath = path.resolve(`./src/public/uploads/${currentImage}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar la imagen anterior
            }
        }

        // Guardar o actualizar la nueva imagen
        await controller.saveUserImage(id, userimage);
        return responses.success(req, res, { message: "User profile image updated successfully" }, 200);
    } catch (error) {
        return responses.error(req, res, { message: error.message }, 500);
    }
});
/*
// Ruta para actualizar la imagen de usuario
router.put("/update/userimage/:id", upload.single("userimage"), async (req, res) => {
    const { id } = req.params;
    const userimage = req.file ? req.file.filename : null;

    if (!userimage) {
        return responses.error(req, res, { message: "No image uploaded" }, 400);
    }

    try {
        // Obtener la imagen actual del usuario
        const currentImage = await controller.saveUserImage(id);
        if (currentImage) {
            const imagePath = path.resolve(`./src/public/uploads/${currentImage}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar la imagen anterior
            }
        }

        // Actualizar la imagen en la base de datos
        await controller.updateUserImageById(id, userimage);
        return responses.success(req, res, { message: "User profile image updated successfully" }, 200);
    } catch (error) {
        return responses.error(req, res, { message: error.message }, 500);
    }
});*/

// Exportar el enrutador
module.exports = router;
