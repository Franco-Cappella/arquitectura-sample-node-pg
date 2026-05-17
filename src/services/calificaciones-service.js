import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import MateriasService from './materias-service.js';
import AlumnosService from './alumnos-service.js';
export default class CalificacionesService {
    constructor() { 
                console.log('Estoy en: CalificacionesService.constructor()');

        this.CalificacionesRepository = new CalificacionesRepository();
        this.MateriasService = new MateriasService();
        this.AlumnosService = new AlumnosService();
    }
    getAllAsync = async () => {
        console.log(`CalificacionesService.getAllAsync()`);
        return await this.CalificacionesRepository.getAllAsync();
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesService.getByIdAsync(${id})`);
        return await this.CalificacionesRepository.getByIdAsync(id);
    }

    getByMateriasIdAsync = async (fk) => {
        console.log(`BUSCANDO POR ID MATERIA: CalificacionesService.getByMateriasIdAsync(${fk})`);
        return await this.CalificacionesRepository.getByMateriasIdAsync(fk);
    }

    getByAlumnoAsync = async (idAlumno) => {
        console.log(`CalificacionesService.getByAlumnoAsync(${idAlumno})`);
        const alumno = await this.AlumnosService.getByIdAsync(idAlumno);
        if (!alumno) {
            const error = new Error(`El alumno con id ${idAlumno} no existe.`);
            error.statusCode = 404; // Not Found
            throw error;
        }
        return await this.CalificacionesRepository.getByAlumnoAsync(idAlumno);
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesService.createAsync`);
        
        if (entity.nota === undefined || entity.nota === null || !Number.isInteger(Number(entity.nota)) || Number(entity.nota) < 0 || Number(entity.nota) > 10) {
            const error = new Error("La nota debe ser un número entero entre 0 y 10.");
            error.statusCode = 400; // Bad Request
            throw error;
        }
        const alumno = await this.AlumnosService.getByIdAsync(entity.idAlu);
        if (!alumno) {
            const error = new Error(`El alumno con id ${entity.idAlu} no existe.`);
            error.statusCode = 400; // Bad Request
            throw error;
        }
        const materia = await this.MateriasService.getByIdAsync(entity.idMat);
        if (!materia) {
            const error = new Error(`La materia con id ${entity.idMat} no existe.`);
            error.statusCode = 400; // Bad Request
            throw error;
        }

        const existing = await this.CalificacionesRepository.getByAlumnoAndMateriaAsync(entity.idAlu, entity.idMat);
        if (existing) {
            const error = new Error(`Ya existe una calificación para el alumno ${entity.idAlu} en la materia ${entity.idMat}.`);
            error.statusCode = 409; // Conflict
            throw error;
        }
        
        return await this.CalificacionesRepository.createAsync(entity);
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesService.updateAsync`);
        const existing = await this.CalificacionesRepository.getByIdAsync(entity.id);
        if (!existing) {
            const error = new Error(`No se encontró la calificación (id: ${entity.id}).`);
            error.statusCode = 404; // Not Found
            throw error;
        }
        if (entity.nota !== undefined && entity.nota !== null) {
            if (!Number.isInteger(Number(entity.nota)) || Number(entity.nota) < 0 || Number(entity.nota) > 10) {
                const error = new Error("La nota debe ser un número entero entre 0 y 10.");
                error.statusCode = 400; // Bad Request
                throw error;
            }
        }

        return await this.CalificacionesRepository.updateAsync(entity);
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesService.deleteByIdAsync(${id})`);
        return await this.CalificacionesRepository.deleteByIdAsync(id);
    }

}   