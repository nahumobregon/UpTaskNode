const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

//se modifico porque el slug , se utilizara en el modelo Proyectos.js
//const slug = require('slug');

exports.proyectosHome = async (req, res) => {
	//res.send('Inicio');
	//console.log(res.locals.usuario);
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	res.render('index', {
		nombrePagina: 'Proyectos Inicio',
		proyectos,
	});
};

exports.formularioProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	res.render('nuevoproyecto', {
		nombrePagina: 'Nuevo Proyecto',
		proyectos,
	});
};

//la sintaxis para Promises es :
//exports.nuevoProyecto = (req, res) => {
//la sintaxis para Async Await es :
exports.nuevoProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });

	//res.send('Enviaste datos de nuevo proyecto');
	//enviar a la consola lo que el usuario escriba
	//console.log('El req.body en la consola desde proyectosControllers.js : ');
	//console.log(req.body);
	// respuesta : undefined ... esto pasa si no esta activo el bodyParser
	//hay que habilitar el bodyParser , en el archivo de configuracion de express
	// respuesta : {nombre: 'Proyecto up Task} ... si ya esta activo el bodyParser

	const { nombre } = req.body;

	let errores = [];
	if (!nombre) {
		errores.push({ texto: 'Agrega un Nombre al proyecto' });
	}

	console.log('Errores desde proyectosController: ');
	console.log(errores);

	//si hay errores
	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos,
		});
	} else {
		//No hay errores
		//insertar en la base de datos
		//Syntaxis para promises es :
		/*
		Proyectos.create({ nombre })
			.then(() =>
				console.log('proyectosControllers.js Proyecto insertado correctamente')
			)
			.catch((error) => console.log(error));
		*/
		// con slug podemos crear la url con guiones en los espacios,
		//pero , se pueden repetir las url
		/*
		const url = slug(nombre).toLowerCase();
		*/
		//asi que mejor vamos a usar los hooks de sequelize
		//los hooks se utilizan en el modelo, en este caso
		// hay que ir a Proyectos.js

		//Syntaxis para async await es :
		//const proyecto = await Proyectos.create({ nombre, url });
		const usuarioId = res.locals.usuario.id;
		const proyecto = await Proyectos.create({ nombre, usuarioId });
		res.redirect('/');
		//res.send('Insertar en la base de datos');
	}
};

exports.proyectoPorUrl = async (req, res, next) => {
	// es recomendable si se tienen multiples consultas
	// colocarlas dentro de un promise
	const usuarioId = res.locals.usuario.id;

	const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

	//res.send('Listado del proyecto :' + req.params.url);
	const proyectoPromise = Proyectos.findOne({
		where: {
			url: req.params.url,
			usuarioId,
		},
	});

	const [proyectos, proyecto] = await Promise.all([
		proyectosPromise,
		proyectoPromise,
	]);

	//Consultar tareas del proyecto actual
	//console.log('Proyecto:');
	//console.log(proyecto);
	const tareas = await Tareas.findAll({
		where: {
			proyectoId: proyecto.id,
		},
		//La siguiente linea es como hacer joun con la tabla de proyectos
		//include: [{ model: Proyectos }],
	});
	//console.log(tareas);

	if (!proyecto) return next();

	//console.log(proyecto);
	//res.send('consulta realizada');

	res.render('tareas', {
		nombrePagina: 'Tareas del Proyecto',
		proyecto,
		proyectos,
		tareas,
	});
};

exports.formularioEditar = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

	const proyectoPromise = Proyectos.findOne({
		where: {
			id: req.params.id,
			usuarioId,
		},
	});

	const [proyectos, proyecto] = await Promise.all([
		proyectosPromise,
		proyectoPromise,
	]);

	// render a la vista
	res.render('nuevoProyecto', {
		nombrePagina: 'Editar Proyecto',
		proyectos,
		proyecto,
	});
};

exports.actualizarProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });

	//res.send('Enviaste datos de nuevo proyecto');
	//enviar a la consola lo que el usuario escriba
	//console.log('El req.body en la consola desde proyectosControllers.js : ');
	//console.log(req.body);

	const { nombre } = req.body;

	let errores = [];
	if (!nombre) {
		errores.push({ texto: 'Agrega un Nombre al proyecto' });
	}

	//console.log('Errores desde proyectosController: ');
	//console.log(errores);

	//si hay errores
	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos,
		});
	} else {
		await Proyectos.update(
			{ nombre: nombre },
			{ where: { id: req.params.id } }
		);
		res.redirect('/');
	}
};

exports.eliminarProyecto = async (req, res, next) => {
	//req.query o req.params
	//console.log(req.query);
	//respuesta= { urlProyecto: 'diseno-de-logotipo' }
	const { urlProyecto } = req.query;

	const resultado = await Proyectos.destroy({
		where: {
			url: urlProyecto,
		},
	});

	if (!resultado) {
		return next();
	}
	res.status(200).send('Proyecto Eliminado Correctamente');
};
