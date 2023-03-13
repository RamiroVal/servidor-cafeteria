const { Router } = require("express");
const { check } = require("express-validator");
const {
	createCategory,
	deleteCategory,
	refreshCategory,
	getCategories,
	getCategory,
} = require("../controllers/categories.js");
const { existeCategoriaPorId } = require("../helpers/db-validators.js");

const { campVaidator } = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const { tieneRole } = require("../middlewares/validar-roles.js");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", getCategories);

// Obtener una categoria por id - publico
router.get(
	"/:id",
	check("id", "No es un id válido").isMongoId(),
	check("id").custom(existeCategoriaPorId),
	campVaidator,
	getCategory
);

// Crear categoría - privado - cualquier persona con un token válido
router.post(
	"/",
	validarJWT,
	check("name", "El nombre se obligatorio").not().isEmpty(),
	campVaidator,
	createCategory
);

// Actualizar registro por id - privado - cualquiera con token válido
router.put(
	"/:id",
	validarJWT,
	check("name", "El nombre es obligatorio"),
	check("id", "No es un id válido").isMongoId(),
	check("id").custom(existeCategoriaPorId),
	campVaidator,
	refreshCategory
);

// Borrar una categoría - admin
router.delete(
	"/:id",
	validarJWT,
	tieneRole("ADMIN_ROLE"),
	check("id", "No es un id válido").isMongoId(),
	check("id").custom(existeCategoriaPorId),
	campVaidator,
	deleteCategory
);

module.exports = router;
