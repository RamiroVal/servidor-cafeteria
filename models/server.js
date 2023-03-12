const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.authPath = "/api/auth";
		this.usersPath = "/api/users";

		// Coneccion BD
		this.connectDB();

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicacion
		this.routes();
	}

	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio Público
		this.app.use(express.static("public"));
	}

	routes() {
		this.app.use(this.authPath, require("../routes/auth"));
		this.app.use(this.usersPath, require("../routes/users"));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Servidor corriendo en puerto", this.port);
		});
	}
}

module.exports = Server;
