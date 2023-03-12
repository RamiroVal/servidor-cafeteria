const { Router } = require("express");
const { check } = require("express-validator");

const {
	esRolValido,
	emailExists,
	existeUsuarioPorId,
} = require("../helpers/db-validators");

const { campVaidator } = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const { esAdminRol, tieneRole } = require("../middlewares/validar-roles");

const {
	usersGet,
	usersPut,
	usersPost,
	usersDelete,
	usersPatch,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);
router.put(
	"/:id",
	check("id", "No es un id válido").isMongoId(),
	check("id").custom(existeUsuarioPorId),
	check("rol").custom(esRolValido),
	campVaidator,
	usersPut
);
router.post(
	"/",
	check("name", "El nombre es obligatorio").not().isEmpty(),
	check("password", "El password debe de ser superior de 6 letras").isLength({
		min: 6,
	}),
	check("correo", "El correo no es válido").isEmail(),
	check("correo").custom(emailExists),
	check("rol").custom(esRolValido),
	campVaidator,
	usersPost
);
router.delete(
	"/:id",
	validarJWT,
	// esAdminRol,
	tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
	check("id", "No es un id válido").isMongoId(),
	check("id").custom(existeUsuarioPorId),
	campVaidator,
	usersDelete
);
router.patch("/", usersPatch);

module.exports = router;
