const multer = require('multer');
const express = require('express');
const router = express.Router();
const responses = require('../../red/responses');

const fs = require('fs');
const pdf = require('pdf-parse');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads'); // Destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB límite
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType) {
            return cb(null, true);
        }
        cb(new Error('El archivo debe ser una imagen o un PDF.'));
    }
}).single("file")

router.post("/upload", async (req, res) => {
    await upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Un error de Multer ocurrió durante la subida.
            console.error(err.message)
            console.log(req)
            return;

        } else if (err) {

            console.error(err.message)
            console.log(req)

            return;
        }

        try {
            // Read and parse PDF content
            const dataBuffer = fs.readFileSync(req.file?.path)
            const pdfData = await pdf(dataBuffer)
            let pdfText = pdfData.text
            const cleanedData = pdfText
                .replace(/[✓●]/g, '')           // Eliminar caracteres específicos como ✓ y ●
                .replace(/\s+/g, ' ')            // Reemplazar múltiples espacios por un solo espacio
                .replace(/^\s+|\s+$/gm, '');

            // Crear y escribir en el archivo
            fs.writeFile(`./src/public/uploads/${req.file.filename}.txt`, cleanedData, (err) => {
                if (err) {
                    console.error('Error al crear el archivo:', err);
                } else {
                    console.log('Archivo creado exitosamente', cleanedData);
                }
            });

            return responses.success(req, res, { message: "upload complete!" }, 200)

        } catch (err) {
            // Send error response if any part of the process fails

        }

    })
})

module.exports = router;
//el oli specials .... neo091