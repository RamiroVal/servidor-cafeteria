const { Router } = require("express");
const { check } = require("express-validator");

const { campVaidator } = require("../middlewares/validar-campos");
const { login, googleSignIn } = require("../controllers/auth");

const router = Router();

router.post(
	"/login",
	check("correo", "El correo es obligatorio").isEmail(),
	check("password", "La contraseña es obligatoria").not().isEmpty(),
	campVaidator,
	login
);

router.post(
	"/google",
	check("id_token", "id_token es necesario").not().isEmpty(),
	campVaidator,
	googleSignIn
);

module.exports = router;
