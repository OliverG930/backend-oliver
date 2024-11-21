
const db = require("../../DB/crud");
const TABLES = require("../../utils/tables");
const fs = require("fs");
const path = require("path");

// --- Helper Functions 1 ---
const getImagePath = (filename) => {
  const uploadDir = process.env.IMAGE_UPLOAD_DIR || './src/public/uploads'; // Allow dynamic configuration
  return path.resolve(uploadDir, filename);
};

const deleteFileIfExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error.message); // Log error but continue execution
  }
};

// --- User Image (Profile) ---
const saveUserImage = async (usuario_id, userimage) => {
  try {
    return await db.insertOrUpdateUserImage(TABLES.USUARIOS, usuario_id, userimage);
  } catch (error) {
    throw new Error("Error saving user image: " + error.message);
  }
};

const getUserImageById = async (usuario_id) => {
  const result = await db.selectOneWhere(TABLES.USUARIOS, { usuario_id });
  if (result && result.userimage) {
    return result.userimage; // Return only the profile image
  }
  return null; // Return null instead of throwing error if image not found
};

const updateUserImageById = async (usuario_id, userimage) => {
  try {
    return await db.update(TABLES.USUARIOS, { userimage }, { usuario_id });
  } catch (error) {
    throw new Error("Error updating user image: " + error.message);
  }
};

const deleteUserImage = async (usuario_id) => {
  try {
    const userImage = await getUserImageById(usuario_id);
    if (userImage) {
      deleteFileIfExists(getImagePath(userImage));
    }
    return await db.delete(TABLES.USUARIOS, { usuario_id });
  } catch (error) {
    throw new Error("Error deleting user image: " + error.message);
  }
};

// --- User Background (Background Image) ---
const saveUserBackground = async (usuario_id, userbackground) => {
  try {
    return await db.insertOrUpdateUserBackground(TABLES.USUARIOS, usuario_id, userbackground);
  } catch (error) {
    throw new Error("Error saving user background: " + error.message);
  }
};

const getUserBackgroundById = async (usuario_id) => {
  const result = await db.selectOneWhere(TABLES.USUARIOS, { usuario_id });
  if (result && result.userbackground) {
    return result.userbackground; // Return only the background image
  }
  return null; // Return null instead of throwing error if background not found
};

const updateUserBackgroundById = async (usuario_id, userbackground) => {
  try {
    return await db.update(TABLES.USUARIOS, { userbackground }, { usuario_id });
  } catch (error) {
    throw new Error("Error updating user background: " + error.message);
  }
};

const deleteUserBackground = async (usuario_id) => {
  try {
    const userBackground = await getUserBackgroundById(usuario_id);
    if (userBackground) {
      deleteFileIfExists(getImagePath(userBackground));
    }
    return await db.delete(TABLES.USUARIOS, { usuario_id });
  } catch (error) {
    throw new Error("Error deleting user background: " + error.message);
  }
};

module.exports = {
  saveUserImage,
  getUserImageById,
  updateUserImageById,
  deleteUserImage,
  saveUserBackground,
  getUserBackgroundById,
  updateUserBackgroundById,
  deleteUserBackground,
};
