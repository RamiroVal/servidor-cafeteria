const dbValidators = require("./db-validators");
const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");
const validarArchivoSubir = require("./subir-archivos");

module.exports = {
	...dbValidators,
	...generarJWT,
	...googleVerify,
	...validarArchivoSubir,
};
