const campVaidator = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar-roles");

module.exports = {
	...campVaidator,
	...validarJWT,
	...validaRoles,
};
