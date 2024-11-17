const db = require("../../DB/crud");
const TABLES = require("../../utils/tables");
const fs = require("fs");
const path = require("path");

const saveUserImage = async (usuario_id, userimage) => {
    return db.insertOrUpdateUserImage(TABLES.USUARIOS, usuario_id, userimage);
};

const getUserImageById = async (usuario_id) => {
    const result = await db.select(TABLES.USUARIOS, { usuario_id });
    if (result && result.length > 0) {
        return result[0].userimage;
    }
    throw new Error("Image not found");
    //return null; // Si no se encuentra, devuelve null en lugar de lanzar un error
};



const updateUserImageById = async (usuario_id, userimage) => {
    return db.update(TABLES.USUARIOS, { usuario_id }, { userimage });
};

const deleteUserImage = async (usuario_id) => {
    const userImage = await getUserImageById(usuario_id);
    if (userImage) {
        const imagePath = path.resolve(`./src/public/uploads/${userImage}`);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    return db.delete(TABLES.USUARIOS, { usuario_id });
};

module.exports = {
    saveUserImage,
    getUserImageById,
    updateUserImageById,
    deleteUserImage,
};
