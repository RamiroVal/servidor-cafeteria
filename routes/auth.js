const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/auth");
const { campVaidator } = require("../middlewares/validar-campos");

const router = Router();

router.post(
	"/login",
	check("correo", "El correo es obligatorio").isEmail(),
	check("password", "La contraseña es obligatoria").not().isEmpty(),
	campVaidator,
	login
);

module.exports = router;
