const { Router } = require("express");
const { check } = require("express-validator");

const { campVaidator } = require("../middlewares/validar-campos");
const {
	cargarArchivo,
	actualizarImagen,
	mostrarImagen,
	actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const { coleccionesPermitidas } = require("../helpers/db-validators");

const router = Router();

router.get(
	"/:coleccion/:id",
	[
		check("id", "El id no es válido").isMongoId(),
		check("coleccion").custom((c) =>
			coleccionesPermitidas(c, ["users", "products"])
		),
		campVaidator,
	],
	mostrarImagen
);

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
	"/:coleccion/:id",
	[
		validarArchivoSubir,
		check("id", "El id no es válido").isMongoId(),
		check("coleccion").custom((c) =>
			coleccionesPermitidas(c, ["users", "products"])
		),
		campVaidator,
	],
	// actualizarImagen
	actualizarImagenCloudinary
);

module.exports = router;
