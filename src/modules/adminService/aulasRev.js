//Este es: aulasRev.js
const { getConnection } = require('../../DB/crud');
const TABLES = require('../../utils/tables');

// Función para obtener todas las aulas
const getAllAulas = (callback) => {
    const query = `
        SELECT 
            aula_id, 
            nombre_aula, 
            nivel, 
            aula_descripcion 
        FROM ${TABLES.AULA_VIRTUAL}  
    `;
    getConnection().query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener todas las aulas:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

// Función para obtener un usuario por su ID
const getAulaById = (aulaId, callback) => {
    const query = `
        SELECT 
            nombre_aula,
            aula_id
        FROM ${TABLES.AULA_VIRTUAL} 
        WHERE aula_id = ?
    `;

   
     getConnection().query(query, [aulaId], (err, results) => {
        //connection.release(); // Liberar la conexión
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(null, null); // No se encontró el usuario
        }
        callback(null, results[0]); // Retorna el primer resultado
    });
    
};

const updateAula = (aulaId, nombre_aula, aula_descripcion, callback) => {
    const query = `
        UPDATE ${TABLES.AULA_VIRTUAL}
        SET nombre_aula = ?, aula_descripcion = ?
        WHERE aula_id = ?
    `;

    getConnection().query(query, [nombre_aula, aula_descripcion, aulaId], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results); // Retorna los resultados de la actualización
    });
};

const updateDescripcionAula = (aulaId, aula_descripcion, callback) => {
    const query = `
        UPDATE ${TABLES.AULA_VIRTUAL}
        SET aula_descripcion = ?
        WHERE aula_id = ?
    `;

    getConnection().query(query, [aula_descripcion, aulaId], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results); // Retorna los resultados de la actualización
    });
};


const updateNombreAula = (aulaId, nombre_aula, callback) => {
    const query = `
        UPDATE ${TABLES.AULA_VIRTUAL}
        SET nombre_aula = ?
        WHERE aula_id = ?
    `;

    getConnection().query(query, [nombre_aula, aulaId], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results); // Retorna los resultados de la actualización
    });
};




const deleteAula = (aulaId, callback) => {
    const query = `
        DELETE FROM ${TABLES.AULA_VIRTUAL}
        WHERE aula_id = ?
    `;

    getConnection().query(query, [aulaId], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results); // Retorna los resultados de la eliminación
    });
};





module.exports = {
    getAllAulas,
    getAulaById,
    updateAula,
    updateNombreAula,
    updateDescripcionAula,
    deleteAula
};
