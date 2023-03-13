const { request, response } = require("express");
const { Product } = require("../models");

const getProducts = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { status: true };

	const [total, products] = await Promise.all([
		Product.countDocuments(query),
		Product.find(query)
			.populate("user", "name")
			.populate("category", "name")
			.skip(Number(desde))
			.limit(Number(limite)),
	]);

	res.json({
		total,
		products,
	});
};

const getProduct = async (req = request, res = response) => {
	const { id } = req.params;
	const categoria = await Product.findById(id)
		.populate("user", "name")
		.populate("category", "name");
	res.json(categoria);
};

const addProduct = async (req = request, res = response) => {
	const { status, user, ...body } = req.body;
	const productDB = await Product.findOne({ name: body.name.toUpperCase() });

	if (productDB) {
		return res.status(400).json({
			msg: "Ya existe el producto",
		});
	}

	const data = {
		...body,
		name: body.name.toUpperCase(),
		user: req.user._id,
	};

	const product = await new Product(data);

	await product.save();

	res.status(201).json(product);
};

const updateProduct = async (req = request, res = response) => {
	const { id } = req.params;
	const { status, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}
	data.user = req.user._id;

	const product = await Product.findByIdAndUpdate(id, data, { new: true });

	res.json(product);
};

const deleteProduct = async (req = require, res = response) => {
	const { id } = req.params;
	const deletedProduct = await Product.findOneAndUpdate(
		id,
		{ status: false },
		{ new: true }
	);

	res.json(deletedProduct);
};

module.exports = {
	getProducts,
	getProduct,
	addProduct,
	updateProduct,
	deleteProduct,
};
