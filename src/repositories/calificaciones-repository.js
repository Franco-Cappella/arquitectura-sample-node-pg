import pool from './../configs/db-config.js';
import LogHelper from './../helpers/log-helper.js'

export default class CalificacionesRepository {
    constructor() {
        console.log('Estoy en: CalificacionesRepository.constructor()');
    }

    getByMateriasIdAsync = async (fk) => {
        console.log(`CalificacionesRepository.getByMateriasIdAsync(${fk})`);
        let returnArray = null;

        try {
            const sql = `SELECT * FROM calificaciones WHERE id_materia=$1`;
            const values = [fk];
            const resultPg = await pool.query(sql, values);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }
    getAllAsync = async () => {
        console.log(`CalificacionesRepository.getAllAsync()`);
        let returnArray = null;

        try {
            const sql = `SELECT
                    calificaciones.id,
                    calificaciones.id_alumno,
                    alumnos.nombre AS nombre_alumno,
                    alumnos.apellido AS apellido_alumno,
                    calificaciones.id_materia,
                    materias.nombre AS nombre_materia,
                    calificaciones.nota,
                    calificaciones.fecha
                FROM calificaciones
                INNER JOIN alumnos ON alumnos.id = calificaciones.id_alumno
                INNER JOIN materias ON materias.id = calificaciones.id_materia`;
            const resultPg = await pool.query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesRepository.getByIdAsync(${id})`);
        let returnEntity = null;

        try {
            const sql = `SELECT
                    calificaciones.id,
                    calificaciones.id_alumno,
                    alumnos.nombre AS nombre_alumno,
                    alumnos.apellido AS apellido_alumno,
                    calificaciones.id_materia,
                    materias.nombre AS nombre_materia,
                    calificaciones.nota,
                    calificaciones.fecha
                FROM calificaciones
                INNER JOIN alumnos ON alumnos.id = calificaciones.id_alumno
                INNER JOIN materias ON materias.id = calificaciones.id_materia
                WHERE calificaciones.id = $1`;
            const values = [id];
            const resultPg = await pool.query(sql, values);
            if (resultPg.rows.length > 0) {
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnEntity;
    }

    getByAlumnoAsync = async (idAlumno) => {
        console.log(`CalificacionesRepository.getByAlumnoAsync(${idAlumno})`);
        let returnArray = null;

        try {
            const sql = `SELECT
                            calificaciones.id,
                            calificaciones.id_materia,
                            materias.nombre AS nombre_materia,
                            calificaciones.nota,
                            calificaciones.fecha
                        FROM calificaciones
                        INNER JOIN materias ON materias.id = calificaciones.id_materia
                        WHERE calificaciones.id_alumno = $1`;
            const values = [idAlumno];
            const resultPg = await pool.query(sql, values);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    getByAlumnoAndMateriaAsync = async (idAlumno, idMateria) => {
        console.log(`CalificacionesRepository.getByAlumnoAndMateriaAsync(${idAlumno}, ${idMateria})`);
        let returnEntity = null;

        try {
            const sql = `SELECT * FROM calificaciones WHERE id_alumno = $1 AND id_materia = $2`;
            const values = [idAlumno, idMateria];
            const resultPg = await pool.query(sql, values);
            if (resultPg.rows.length > 0) {
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesRepository.createAsync(${JSON.stringify(entity)})`);
        let newId = 0;

        try {
            const sql = entity?.fecha
                ? `INSERT INTO calificaciones (id_alumno, id_materia, nota, fecha) VALUES ($1, $2, $3, $4) RETURNING id`
                : `INSERT INTO calificaciones (id_alumno, id_materia, nota, fecha) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING id`;
            const values = entity?.fecha
                ? [entity.idAlu, entity.idMat, entity.nota, entity.fecha]
                : [entity.idAlu, entity.idMat, entity.nota];
            const resultPg = await pool.query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            LogHelper.logError(error);
        }
        return newId;
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesRepository.updateAsync(${JSON.stringify(entity)})`);
        let rowsAffected = 0;
        let id = entity.id;

        try {
            const previousEntity = await this.getByIdAsync(id);
            if (previousEntity == null) return 0;
            const sql = `UPDATE calificaciones SET 
                            nota = $2,
                            fecha = $3
                        WHERE id = $1`;

            const values = [
                id,
                entity?.nota ?? previousEntity?.nota,
                entity?.fecha ?? previousEntity?.fecha
            ];
            const resultPg = await pool.query(sql, values);

            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;

        try {
            const sql = `DELETE FROM calificaciones WHERE id = $1`;
            const values = [id];
            const resultPg = await pool.query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}