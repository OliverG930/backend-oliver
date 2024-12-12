//Este es: usuariosRev.js
const { getConnection, select } = require('../../DB/crud');
const TABLES = require('../../utils/tables');


const getAllUsuarios = (callback) => {
    const query = `
          SELECT 
        usuario_id,
        nombre,
        apellido,
        correo,
         rol_id,
        estado
    FROM ${TABLES.USUARIOS}
    `;

    console.log("Ejecutando consulta:", query); // Log de la consulta SQL

    getConnection().query(query, (err, results) => {
        if (err) {
            console.error("Error al ejecutar la consulta:", err); // Log del error
            return callback({ error: 'Error al ejecutar la consulta', details: err });
        }
        if (results.length === 0) {
            console.log("No se encontraron usuarios.");
            return callback(null, []); // No hay usuarios
        }
        console.log("Usuarios encontrados:", results.length);
        callback(null, results); // Retorna los resultados
    });
};








// Función para obtener un usuario por su ID
const getUsuarioById = (usuarioId, callback) => {
    const query = `
        SELECT 
        usuario_id,
        nombre,
        apellido,
        correo,
          rol_id,
        estado
    FROM ${TABLES.USUARIOS}
        WHERE usuario_id = ?
    `;

    getConnection().query(query, [usuarioId], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(null, null); // No se encontró el usuario
        }
        callback(null, results[0]); // Retorna el primer resultado
    });
};


const updateUsuario = (usuarioId, { nombre, apellido, correo, rol_id, estado }, callback) => {
    // Validar que el usuarioId sea válido
    if (!usuarioId || isNaN(usuarioId)) {
        return callback(new Error("El ID de usuario no es válido"));
    }

    // Crear arrays de campos y valores a actualizar
    const fields = [];
    const values = [];

    // Solo añadir los campos que estén presentes
    if (nombre) {
        fields.push("nombre = ?");
        values.push(nombre);
    }

    if (apellido) {
        fields.push("apellido = ?");
        values.push(apellido);
    }

    if (correo) {
        fields.push("correo = ?");
        values.push(correo);
    }

    if (estado) {
        fields.push("estado = ?");
        values.push(estado);
    }

    if (rol_id) {
        fields.push("rol_id = ?");
        values.push(rol_id);
    }

    // Verificar si hay campos para actualizar
    if (fields.length === 0) {
        return callback(new Error("No se proporcionaron campos para actualizar"));
    }

    // Agregar el usuarioId al final de los valores
    values.push(usuarioId);

    // Crear la consulta de actualización
    const query = `
        UPDATE ${TABLES.USUARIOS}
        SET ${fields.join(", ")}
        WHERE usuario_id = ?
    `;

    // Ejecutar la consulta
    getConnection().query(query, values, (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta UPDATE:', err);
            return callback(err);
        }

        if (results.affectedRows === 0) {
            return callback(new Error('El usuario no fue actualizado. Es posible que el ID no exista o los datos sean iguales.'));
        }

        console.log('✅ Usuario actualizado con éxito:', results);
        callback(null, results); // Retorna los resultados de la actualización
    });
};





module.exports = {
    getUsuarioById,
    getAllUsuarios,
    updateUsuario
};
