const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		// Verificar si el email existe
		const user = await User.findOne({ correo });
		if (!user) {
			return res.status(400).json({
				msg: "Usuario o contraseña incorrectos - correo",
			});
		}

		// Verificar si el usuario sigue activo
		if (!user.state) {
			return res.status(400).json({
				msg: "Usuario o contraseña incorrectos - status: false",
			});
		}

		// Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: "Usuario o contraseña incorrectos - password",
			});
		}

		// Generar el JWT
		const token = await generarJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Hable con el administrador",
		});
	}
};

module.exports = {
	login,
};
