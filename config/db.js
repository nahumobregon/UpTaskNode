const { Sequelize } = require('sequelize');
//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env' });

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
	process.env.BD_NOMBRE,
	process.env.BD_USER,
	process.env.BD_PASS,
	{
		host: process.env.BD_HOST,
		dialect: 'mysql',
		port: process.env.BD_PORT,
		operatorsAliases: false,
		define: {
			timestamps: false,
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

// Option 2: Passing parameters separately (other dialects)
//const db = new Sequelize('uptasknode', 'root', 'Nhm27noc$.', {
//	host: '127.0.0.1',
//	dialect: 'mysql',
//	port: '3306',
//	operatorsAliases: false,
//	define: {
//		timestamps: false,
//	},
//	pool: {
//		max: 5,
//		min: 0,
//		acquire: 30000,
//		idle: 10000,
//	},
//});

module.exports = db;
