import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import CalificacionesService from './../services/calificaciones-service.js'
import Calificacion from './../entities/calificacion.js'

const router = Router();
const currentService = new CalificacionesService();

//BUSCAR TODOS
router.get('', async (req, res) => {
    try {
        console.log(`CalificacionesController.get`);
        const returnArray = await currentService.getAllAsync();
        if (returnArray != null) {
            res.status(StatusCodes.OK).json(returnArray);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

//BUSCAR POR ALUMNO
router.get('/alumno/:idAlumno', async (req, res) => {
    try {
        let idAlumno = req.params.idAlumno;
        const returnArray = await currentService.getByAlumnoAsync(idAlumno);
        if (returnArray != null) {
            res.status(StatusCodes.OK).json(returnArray);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
        }
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(statusCode).send(error.message);
    }
});

//BUSCAR POR ID
router.get('/:id', async (req, res) => {
    console.log(`CalificacionesController.getById`);

    try {
        let id = req.params.id;
        const returnEntity = await currentService.getByIdAsync(id);
        if (returnEntity != null){
            res.status(StatusCodes.OK).json(returnEntity);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la calificación (id: ${id}).`);
        }
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(statusCode).send(error.message);
    }
});

//BUSCAR POR ALUMNO
router.get('/alumno/:idAlumno', async (req, res) => {
    try {
        let idAlumno = req.params.idAlumno;
        const returnArray = await currentService.getByAlumnoAsync(idAlumno);
        if (returnArray != null) {
            res.status(StatusCodes.OK).json(returnArray);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
        }
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(statusCode).send(error.message);
    }
});

//CREAR CALIFICACION
router.post('', async (req, res) => {
    try {
        const entity = new Calificacion(
            req.body.id_alumno,
            req.body.id_materia,
            req.body.nota,
            req.body.fecha
        );
        const newId = await currentService.createAsync(entity);
        if (newId > 0){
            const newEntity = await currentService.getByIdAsync(newId);
            res.status(StatusCodes.CREATED).json(newEntity);
        } else {
            res.status(StatusCodes.BAD_REQUEST).json(null);
        }
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
        res.status(statusCode).send(error.message);
    }
});

//MODIFICAR CALIFICACION
router.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let entity = req.body;

        if (entity.id && parseInt(entity.id) !== id) {
            return res.status(StatusCodes.BAD_REQUEST).send(`El id de la URL (${id}) no coincide con el id del body (${entity.id}).`);
        }

        entity.id = id;
        const rowsAffected = await currentService.updateAsync(entity);
        if (rowsAffected != 0){
            res.status(StatusCodes.OK).json(rowsAffected);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
        res.status(statusCode).send(error.message);
    }
});

//ELIMINAR CALIFICACION
router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const rowCount = await currentService.deleteByIdAsync(id);
        if (rowCount != 0){
            res.status(StatusCodes.OK).json(null);
        } 
        else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(statusCode).send(error.message);
    }
});


export default router;