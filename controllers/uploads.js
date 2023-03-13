const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivos");
const { User, Product } = require("../models");

const cargarArchivo = async (req = request, res = response) => {
	try {
		const nombre = await subirArchivo(req.files, undefined, "imgs");
		res.json({ nombre });
	} catch (msg) {
		res.status(400).json({ msg });
	}
};

const actualizarImagen = async (req = request, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "users":
			modelo = await User.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: "No existe un usuario con ese id",
				});
			}
			break;
		case "products":
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: "No existe un producto con ese id",
				});
			}
			break;
		default:
			return res.status(500).json({ msg: "Se me olvidó subir esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Hay que borrar la imágen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads",
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) {
			fs.unlinkSync(pathImagen);
		}
	}

	const nombre = await subirArchivo(req.files, undefined, coleccion);
	modelo.img = nombre;
	await modelo.save();

	res.json(modelo);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "users":
			modelo = await User.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: "No existe un usuario con ese id",
				});
			}
			break;
		case "products":
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: "No existe un producto con ese id",
				});
			}
			break;
		default:
			return res.status(500).json({ msg: "Se me olvidó subir esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		const nombreArr = modelo.img.split("/");
		const nombre = nombreArr[nombreArr.length - 1];
		const [public_id] = nombre.split(".");
		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	modelo.img = secure_url;

	await modelo.save();

	res.json(modelo);
};

const mostrarImagen = async (req = request, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "users":
			modelo = await User.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: "No existe un usuario con ese id",
				});
			}
			break;
		case "products":
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: "No existe un producto con ese id",
				});
			}
			break;
		default:
			return res.status(500).json({ msg: "Se me olvidó subir esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Hay que borrar la imágen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads",
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) {
			return res.sendFile(pathImagen);
		}
	}

	const pathImagen = path.join(
		__dirname,
		"../assets/placeholders/no-image.jpg"
	);

	res.sendFile(pathImagen);
};

module.exports = {
	cargarArchivo,
	actualizarImagen,
	mostrarImagen,
	actualizarImagenCloudinary,
};
