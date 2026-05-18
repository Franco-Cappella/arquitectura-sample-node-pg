class ValidacionesHelper {
    getIntegerOrDefault = (value, defaultValue) => {
        let valorParseado = parseInt(value)
        if (isNaN(valorParseado)) {
            return defaultValue;
        } else return valorParseado
    }
    getStringOrDefault = (value, defaultValue) => {
        if (value === null || value === undefined) {
            return defaultValue
        } else return value.toString()
    }
    getDateOrDefault = (value, defaultValue) => {
        let fecha = new Date(value);

        if (isNaN(fecha.getTime())) {
            return defaultValue;
        } else {
            return fecha;
        }
    }
    getBoolOrDefault = (value, defaultValue) => {
        valor = value.toString().toLowerCase()
        if (valor === "true" || valor === "false") {
            return value
        } else return defaultValue
    }
    isEmail = (value) => {
        if (typeof value !== "string") return false
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(value)
        }
    }
    isEmpty = (value) => {
        if (value == null || value == undefined){
            msjError = 'the object is empty'
            return msjError
        }else return value
    }
}
export default new ValidacionesHelper()