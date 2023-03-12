const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { state: true };

	// Permite llamar a dos promesas a la vez, si lo hiciera por separado
	// la BD tardaría el doble
	const [total, usuarios] = await Promise.all([
		User.countDocuments(query),
		User.find(query).skip(Number(desde)).limit(Number(limite)),
	]);

	res.json({
		total,
		usuarios,
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

	res.json({ user });
};

const usersDelete = async (req = request, res = response) => {
	const { id } = req.params;

	// Borrado fisicamente
	// const usuario = await User.findByIdAndDelete(id);

	const usuario = await User.findByIdAndUpdate(id, { state: false });

	res.json(usuario);
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
