const { request, response } = require("express");

const { Category } = require("../models");

// getCategories - paginado - total - populate
const getCategories = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { status: true };

	// Permite llamar a dos promesas a la vez, si lo hiciera por separado
	// la BD tardaría el doble
	const [total, categories] = await Promise.all([
		Category.countDocuments(query),
		Category.find(query)
			.populate("user", "name")
			.skip(Number(desde))
			.limit(Number(limite)),
	]);

	res.json({
		total,
		categories,
	});
};

// getCategorie - populate {}
const getCategory = async (req = request, res = response) => {
	const { id } = req.params;
	const categoria = await Category.findById(id).populate("user", "name");

	res.json(categoria);
};

// createCategory crear categoria
const createCategory = async (req = request, res = response) => {
	const name = req.body.name.toUpperCase();
	const categoryDB = await Category.findOne({ name });

	if (categoryDB) {
		return res.status(400).json({
			msg: "La categoría ya existe",
		});
	}

	// Generar la data a guardar
	const data = {
		name,
		user: req.user._id,
	};

	const category = await new Category(data);

	// Guardar DB
	await category.save();

	res.status(201).json(category);
};

// refreshCategory cambiar nombre de categoria
const refreshCategory = async (req = request, res = response) => {
	const { id } = req.params;
	const { status, user, ...data } = req.body;

	data.name = data.name.toUpperCase();
	data.user = req.user._id;

	const category = await Category.findByIdAndUpdate(id, data, { new: true });

	res.status(400).json(category);
};

// deleteCategorie - Cambiar estado a false
const deleteCategory = async (req = request, res = response) => {
	const { id } = req.params;

	const category = await Category.findByIdAndUpdate(id, { status: false });

	res.json(category);
};

module.exports = {
	createCategory,
	deleteCategory,
	refreshCategory,
	getCategories,
	getCategory,
};
