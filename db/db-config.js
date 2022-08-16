//CLASE 28 ENV
require('dotenv').config();

//CLASE 16 CONFIGURACIÓN
const mysql = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.HOST_MYSQL,
		port: process.env.PORT_MYSQL,
		user: process.env.USER_MYSQL,
		password: '',
		database: process.env.DATABASE_MYSQL
	},
	pool: { min: 2, max: 8 }
});
//CLASE 16 CONFIGURACIÓN

//CLASE 24 CONFIGURACIÓN
const mongoAtlas = {
	client: 'mongodb',
	conString: `mongodb+srv://${process.env.MONGO_ATLAS_USER}@${process.env.MONGO_ATLAS_CLUSTER}/?retryWrites=true&w=majority`,
};
//

//CLASE 26 CONFIGURACION
const mongodbU = {
	cnxStr: `mongodb://localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000
	}
};

module.exports = {mysql, mongoAtlas, mongodbU};
