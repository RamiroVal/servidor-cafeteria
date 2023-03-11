const { request, response } = require("express");

const usersGet = (req = request, res = response) => {
	const { q, nombre = "No name", apikey } = req.query;

	res.json({
		msg: "get API - controlador",
		q,
		nombre,
		apikey,
	});
};

const usersPut = (req = request, res = response) => {
	const { id } = req.params;

	res.status(400).json({
		msg: "put API - controlador",
		id,
	});
};

const usersPost = (req = request, res = response) => {
	const { name, age } = req.body;
	res.json({
		msg: "post API - controlador",
		name,
		age,
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
