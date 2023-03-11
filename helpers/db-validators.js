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

module.exports = {
	esRolValido,
	emailExists,
	existeUsuarioPorId,
};
