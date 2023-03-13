const { Router } = require("express");
const { check } = require("express-validator");
const {
	getProducts,
	getProduct,
	addProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/products");
const {
	existeProductoPorId,
	existeCategoriaPorId,
} = require("../helpers/db-validators");
const { campVaidator } = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const { esAdminRol } = require("../middlewares/validar-roles");

const router = Router();

// Obtener todos los productos - publico
router.get("/", getProducts);

// Obtener una categoria por id - publico
router.get(
	"/:id",
	check("id", "No es un id de Mongo válido").isMongoId(),
	check("id").custom(existeProductoPorId),
	campVaidator,
	getProduct
);

// Añadir producto - privado - cualquier persona con un token válido
router.post(
	"/",
	validarJWT,
	check("name", "El nombre es obligatorio").not().isEmpty(),
	check("category", "No es un id válido").isMongoId(),
	check("category").custom(existeCategoriaPorId),
	campVaidator,
	addProduct
);

// Actualizar registro por id - privado - cualquiera con token válido
router.put(
	"/:id",
	validarJWT,
	check("id", "No es un id válido").isMongoId(),
	check("id").custom(existeProductoPorId),
	campVaidator,
	updateProduct
);

// Borrar una categoría - admin
router.delete(
	"/:id",
	validarJWT,
	esAdminRol,
	check("id", "No es un id de Mongo válido").isMongoId(),
	check("id").custom(existeProductoPorId),
	campVaidator,
	deleteProduct
);

module.exports = router;
