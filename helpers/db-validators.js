const { Category, Product } = require("../models");
const Role = require("../models/role");
const User = require("../models/user");

const esRolValido = async (rol = "") => {
	const existRol = await Role.findOne({ rol });
	if (!existRol) {
		throw new Error(`El rol ${rol} no está registrado en la BD`);
	}
};

const emailExists = async (correo = "") => {
	// Verificar si el correo existe
	const existEmail = await User.findOne({ correo });
	if (existEmail) {
		throw new Error("El email ya existe");
	}
};

const existeUsuarioPorId = async (id) => {
	// Verificar si el correo existe
	const existeUsuario = await User.findOne({ _id: id });
	if (!existeUsuario) {
		throw new Error("El id no existe");
	}
};

const existeCategoriaPorId = async (id) => {
	const categoria = await Category.findOne({ _id: id });
	if (!categoria) {
		throw new Error("No existe la categoria");
	}
};

const existeProductoPorId = async (id) => {
	const producto = await Product.findOne({ _id: id });
	if (!producto) {
		throw new Error("No existe la categoria");
	}
};

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
	const incluida = colecciones.includes(coleccion);
	if (!incluida) {
		throw new Error(`La coleccion ${coleccion} no es permitida`);
	}
	return true;
};

module.exports = {
	esRolValido,
	emailExists,
	existeUsuarioPorId,
	existeCategoriaPorId,
	existeProductoPorId,
	coleccionesPermitidas,
};
