const { response, request } = require("express");

const esAdminRol = (req = request, res = response, next) => {
	if (!req.user) {
		return res.status(500).json({
			msg: "Se quiere verificar el rol sin validar el token primero",
		});
	}

	const { rol, name } = req.user;

	if (rol !== "ADMIN_ROLE") {
		return res.status(401).json({
			msg: `${name} no es administrador`,
		});
	}
	next();
};

const tieneRole = (...roles) => {
	return (req = request, res = response, next) => {
		if (!req.user) {
			return res.status(500).json({
				msg: "Se quiere verificar el rol sin validar el token primero",
			});
		}
		if (!roles.includes(req.user.rol)) {
			return res.status(401).json({
				msg: "No tiene los permisos necesarios",
			});
		}
		next();
	};
};

module.exports = {
	esAdminRol,
	tieneRole,
};
