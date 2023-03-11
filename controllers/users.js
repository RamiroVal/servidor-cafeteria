const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = (req = request, res = response) => {
	const { q, nombre = "No name", apikey } = req.query;

	res.json({
		msg: "get API - controlador",
		q,
		nombre,
		apikey,
	});
};

const usersPut = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	if (password) {
		// Encriptar la contraseña
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await User.findByIdAndUpdate(id, resto, { new: true });

	res.status(400).json({
		msg: "put API - controlador",
		usuario,
	});
};

const usersPost = async (req = request, res = response) => {
	const { name, correo, password, rol } = req.body;
	const user = new User({ name, correo, password, rol });

	// Encriptar la contraseña
	const salt = bcryptjs.genSaltSync();
	user.password = bcryptjs.hashSync(password, salt);

	// Guardar en BD
	await user.save();

	res.json({
		msg: "post API - controlador",
		user,
	});
};

const usersDelete = (req = request, res = response) => {
	res.json({
		msg: "delete API - controlador",
	});
};

const usersPatch = (req = request, res = response) => {
	res.json({
		msg: "patch API - controlador",
	});
};

module.exports = {
	usersGet,
	usersPut,
	usersPost,
	usersDelete,
	usersPatch,
};
