/*
const express = require("express");
const router = express.Router();
const responses = require("../../red/responses");
const controller = require("./controller");
const multer = require("multer");
const path = require("node:path");
const fs = require("fs");

// Configuración de multer
const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), "src/public/uploads"),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// --- Funciones auxiliares ---
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getImagePath = (filename) => path.resolve(`./src/public/uploads/${filename}`);

// --- Rutas ---
router.put("/userimage/:id", upload.single("image"), async (req, res) => {
  const image = req.file?.filename;
  const usuario_id = req.params.id;

  if (!image) {
    return responses.error(req, res, { message: "No image uploaded" }, 400);
  }

  try {
    const currentImage = await controller.getUserImageById(usuario_id);

    if (currentImage) {
      deleteFile(getImagePath(currentImage)); // Eliminar la imagen anterior
    }

    await controller.updateUserImageById(usuario_id, image);

    return responses.success(req, res, { message: "Profile image updated successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

router.put("/background/:id", upload.single("image"), async (req, res) => {
  const image = req.file?.filename;
  const usuario_id = req.params.id;

  if (!image) {
    return responses.error(req, res, { message: "No image uploaded" }, 400);
  }

  try {
    const currentImage = await controller.getUserBackgroundById(usuario_id);

    if (currentImage) {
      deleteFile(getImagePath(currentImage)); // Eliminar la imagen anterior
    }

    await controller.updateUserBackgroundById(usuario_id, image);

    return responses.success(req, res, { message: "Background image updated successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

// Send the image path for frontend to use
router.get("/userimage/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    const image = await controller.getUserImageById(usuario_id);
    if (!image) {
      return responses.error(req, res, { message: "Profile image not found" }, 404);
    }
    // Send the image path as a response, or use sendFile if needed
    return res.json({ imageUrl: `/uploads/${image}` });  // Adjust this based on your frontend needs
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

router.delete("/userimage/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    await controller.deleteUserImage(usuario_id);
    return responses.success(req, res, { message: "Profile image deleted successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

router.get("/background/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    const image = await controller.getUserBackgroundById(usuario_id);
    if (!image) {
      return responses.error(req, res, { message: "Background image not found" }, 404);
    }
    return res.sendFile(getImagePath(image)); // Enviar la imagen de fondo
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

router.delete("/background/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    await controller.deleteUserBackground(usuario_id);
    return responses.success(req, res, { message: "Background image deleted successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const responses = require("../../red/responses");
const controller = require("./controller");
const multer = require("multer");
const path = require("node:path");
const fs = require("fs");


// Configuración de multer
const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), "src/public/uploads"),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// --- Funciones auxiliares ---
// Genera la ruta completa del archivo
const getImagePath = (filename) => path.resolve(process.cwd(), `src/public/uploads/${filename}`);

// Elimina el archivo si existe
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// --- Rutas ---
// Actualizar imagen de perfil del usuario
router.put("/userimage/:id", upload.single("image"), async (req, res) => {
  const image = req.file?.filename;
  const usuario_id = req.params.id;

  if (!image) {
    return responses.error(req, res, { message: "No image uploaded" }, 400);
  }

  try {
    const currentImage = await controller.getUserImageById(usuario_id);

    if (currentImage) {
      deleteFile(getImagePath(currentImage)); // Eliminar la imagen anterior
    }

    await controller.updateUserImageById(usuario_id, image);

    return responses.success(req, res, { message: "Profile image updated successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});


// Obtener imagen de perfil del usuario
router.get("/userimage/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    const image = await controller.getUserImageById(usuario_id);
    if (!image) {
      return responses.error(req, res, { message: "Profile image not found" }, 404);
    }
    // Retorna la URL de la imagen de perfil
    return res.json({ imageUrl: `/uploads/${image}` });  // Ajusta esto según las necesidades del frontend
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

// Eliminar imagen de perfil del usuario
router.delete("/userimage/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    const currentImage = await controller.getUserImageById(usuario_id);

    if (currentImage) {
      deleteFile(getImagePath(currentImage)); // Eliminar la imagen
    }

    await controller.deleteUserImage(usuario_id);

    return responses.success(req, res, { message: "Profile image deleted successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

// --- Rutas ---
// Actualizar imagen de fondo del usuario
router.put("/userbackground/:id", upload.single("image"), async (req, res) => {
  const image = req.file?.filename;
  const usuario_id = req.params.id;

  if (!image) {
    return responses.error(req, res, { message: "No image uploaded" }, 400);
  }

  try {
    const currentImage = await controller.getUserBackgroundById(usuario_id);

    if (currentImage) {
      deleteFile(getImagePath(currentImage)); // Eliminar la imagen anterior
    }

    await controller.updateUserBackgroundById(usuario_id, image);

    return responses.success(req, res, { message: "Background image updated successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

// Obtener imagen de fondo del usuario
router.get("/userbackground/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    const image = await controller.getUserBackgroundById(usuario_id);
    if (!image) {
      return responses.error(req, res, { message: "Background image not found" }, 404);
    }
    // Enviar la imagen de fondo
    return res.sendFile(getImagePath(image), (err) => {
      if (err) {
        return responses.error(req, res, { message: "Failed to send the background image" }, 500);
      }
    });
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});

// Eliminar imagen de fondo del usuario
router.delete("/userbackground/:id", async (req, res) => {
  const usuario_id = req.params.id;

  try {
    const currentImage = await controller.getUserBackgroundById(usuario_id);

    if (currentImage) {
      deleteFile(getImagePath(currentImage)); // Eliminar la imagen de fondo
    }

    await controller.deleteUserBackground(usuario_id);

    return responses.success(req, res, { message: "Background image deleted successfully" }, 200);
  } catch (error) {
    return responses.error(req, res, { message: error.message }, 500);
  }
});



module.exports = router;
