const { request, response, json } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {
	const { id_token } = req.body;

	try {
		const { name, img, correo } = await googleVerify(id_token);
		let usuario = await User.findOne({ correo });

		if (!usuario) {
			// Crear usuario
			const data = {
				name,
				correo,
				rol: "USER_ROLE",
				password: ":P",
				img,
				google: true,
			};
			usuario = new User(data);
			await usuario.save();
		}
		// Si el usuario ya esta dado de baja
		if (!usuario.state) {
			return res.status(401).json({
				msg: "Usuario no autorizado, hable con el administrador",
			});
		}
		// Generar JWT
		const token = await generarJWT(usuario.id);
		res.json({
			usuario,
			token,
		});
	} catch (error) {
		res.status(400).json({
			ok: false,
			msg: "El Token no se pudo verificar",
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
