const mysql = require('./mysql')

const connection = mysql.conn()

function getConnection() {
    return connection;
}

//selecciona de la tabla el primer dato de la consulta recibido desde el  parametro data con este formato {id_usaurio: 1}
const selectOneWhere = (table, data) => {
    return new Promise((_res, _rej) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result) => {
            return err ? _rej(err) : _res(result[0])
        })
    })
}

const select = (table, data) => {
    return new Promise((_res, _rej) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const selectWithJoin = (table_one, table_two, condition, where) => {
    return new Promise((_res, _rej) => {

        const query = `
            SELECT * FROM ${table_one}
            JOIN ${table_two} ON ${condition}
            WHERE ${Object.keys(where).map(key => `${key} = ?`).join(' AND ')}
        `
        // Extraer los valores de la condición WHERE
        const values = Object.values(where);
        connection.query(query, values, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const selectAll = (table) => {
    return new Promise((_res, _rej) => {
        connection.query(`select * from ${table}`, (err, result) => {
            return err ? _rej(err) : _res(result[0])
        })
    })
}

const get = (table) => {
    return new Promise((_res, _rej) => {
        connection.query(`select * from ${table}`, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}


//inserta en la tabla 'table' los datos recibidos desde el  parametro data con este formato {id_usaurio: 1, nombre: 'Marcos', id_rol: 1}
const insert = (table, data) => {
    return new Promise((_res, _rej) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const insertWhere = (table, data, where) => {
    // Construir la parte de la consulta WHERE dinámicamente
    const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(where);

    const checkQuery = `SELECT COUNT(*) AS count FROM ${table} WHERE ${conditions}`;

    return new Promise((_res, _rej) => {
        connection.query(checkQuery, values, (err, results) => {
            if (err) {
                return _rej(err);
            }

            if (results[0].count > 0) {
                return _res({ message: 'Data already exists', exists: true });
            }

            // Si no existen, realiza la inserción
            const insertQuery = `INSERT INTO ${table} SET ?`;
            connection.query(insertQuery, data, (err, result) => {
                return err ? _rej(err) : _res(result);
            });
        })
    })
}


const update = async (table, data, where) => {

    return new Promise((_res, _rej) => {
        connection.query(`UPDATE ${table} SET ? WHERE ?`, [data, where], (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const deleteWhereID = (table, where) => {
    return new Promise((_res, _rej) => {
        connection.query(`DELETE FROM ${table} where ?`, where, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const insertOrUpdateUserImage = async (table, usuario_id, userimage) => {
    return new Promise((_res, _rej) => {
        // Paso 1: Obtener todos los valores actuales de los campos del usuario
        const selectQuery = `SELECT * FROM ${table} WHERE usuario_id = ?`;

        connection.query(selectQuery, [usuario_id], (err, result) => {
            if (err) {
                return _rej(err);
            }

            // Si no se encuentra el usuario
            if (result.length === 0) {
                return _rej(new Error("Usuario no encontrado"));
            }

            // Paso 2: Extraer los valores actuales de los campos
            const userData = result[0];
            const { nombre, apellido, correo, contrasenia, rol_id, ci, tel, userbackground, estado } = userData;

            // Paso 3: Realizar la inserción o actualización solo del campo 'userimage'
            const query = `
                INSERT INTO ${table} (usuario_id, nombre, apellido, correo, contrasenia, rol_id, ci, tel, userimage, userbackground, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE userimage = VALUES(userimage)
            `;

            // Realiza la inserción o actualización, manteniendo los campos no modificados
            connection.query(query, [
                usuario_id, nombre, apellido, correo, contrasenia, rol_id, ci, tel, userimage, userbackground, estado
            ], (err, result) => {
                return err ? _rej(err) : _res(result);
            });
        });
    });
}

module.exports = {
    insert,
    update,
    selectOneWhere,
    select,
    deleteWhereID,
    selectAll,
    get,
    insertWhere,
    selectWithJoin,
    getConnection,
    insertOrUpdateUserImage // Nueva función
}