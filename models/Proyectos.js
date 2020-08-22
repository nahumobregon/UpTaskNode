const Sequelize = require('sequelize');
const db = require('../config/db');

const slug = require('slug');
const shortid = require('shortid');

const Proyectos = db.define(
	'proyectos',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: Sequelize.STRING,
		},
		url: {
			type: Sequelize.STRING,
		},
	},
	{
		hooks: {
			beforeCreate(proyecto) {
				console.log(
					'Hook que se ejecuta en Proyecto.js antes de insertar en la bd'
				);
				const url = slug(proyecto.nombre).toLowerCase();

				proyecto.url = `${url}-${shortid.generate()}`;
			},
		},
	}
);

module.exports = Proyectos;
