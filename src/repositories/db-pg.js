import pool from './../configs/db-config.js';
import LogHelper from './../helpers/log-helper.js'

export default class DbPg {
    constructor() {
    }

    queryAll = async (sql, values = null) => {
        let returnArray = null;
        try {
            const resultPg = values
                ? await pool.query(sql, values)
                : await pool.query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    queryOne = async (sql, values = null) => {
        let returnEntity = null;
        try {
            const resultPg = values
                ? await pool.query(sql, values)
                : await pool.query(sql);
            if (resultPg.rows.length > 0) {
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnEntity;
    }

    queryReturnId = async (sql, values = null) => {
        let newId = 0;
        try {
            const resultPg = values
                ? await pool.query(sql, values)
                : await pool.query(sql);
            newId = resultPg.rows[0].id;
        } catch (error) {
            LogHelper.logError(error);
        }
        return newId;
    }

    queryRowCount = async (sql, values = null) => {
        let rowsAffected = 0;
        try {
            const resultPg = values
                ? await pool.query(sql, values)
                : await pool.query(sql);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}
