const { request, response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = ["categories", "products", "users"];

const buscarUsuarios = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await User.findById(termino);
		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const usuarios = await User.find({
		$or: [{ name: regex }, { correo: regex }],
		$and: [{ state: true }],
	});

	res.json({
		results: usuarios,
	});
};

const buscarCategorias = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const categoria = await Category.findById(termino).populate("user", "name");
		return res.json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const categorias = await Category.find({
		name: regex,
		status: true,
	}).populate("user", "name");

	res.json({
		results: categorias,
	});
};

const buscarProductos = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const producto = await Product.findById(termino)
			.populate("user", "name")
			.populate("category", "name");
		return res.json({
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const productos = await Product.find({ name: regex, status: true })
		.populate("user", "name")
		.populate("category", "name");

	res.json({
		results: productos,
	});
};

const buscar = (req = request, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case "categories":
			buscarCategorias(termino, res);
			break;
		case "products":
			buscarProductos(termino, res);
			break;
		case "users":
			buscarUsuarios(termino, res);
			break;
		default:
			res.status(500).json({
				msg: "Se me olvido hacer esta búsqueda",
			});
	}
};

module.exports = {
	buscar,
};
