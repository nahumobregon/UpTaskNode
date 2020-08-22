const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res) => {
	//res.send('enviado');
	//console.log(req.params.url);
	//console.log(req.body);

	const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
	//console.log(proyecto)

	//leer valor del input
	const { tarea } = req.body;
	const estado = 0;
	const proyectoId = proyecto.id;

	//insertar en la base de datos
	const resultado = await Tareas.create({ tarea, estado, proyectoId });
	if (!resultado) {
		return next();
	}

	//redireccionar
	res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res) => {
	//cuando se manda la peticion con Patch , req.query no funciona
	//console.log(req.query) , tiene que ser con
	//lo siguientye si funciona
	//console.log(req.params);
	//nos reponde el backend { id: '2' }
	const { id } = req.params;
	const tarea = await Tareas.findOne({ where: { id: id } });
	//console.log(tarea);

	//cambiar el estado
	let estado = 0;
	if (tarea.estado === estado) {
		estado = 1;
	}
	tarea.estado = estado;

	const resultado = await tarea.save();

	if (!resultado) return next();

	res.status(200).send('Actualizado  ...');
};

exports.eliminarTarea = async (req, res) => {
	//aqui si podemos utilizar req.query porque en tareas.js del front
	//estamos utilizando axios - delete - params
	//console.log(req.query);
	//resultado de req.query = { idTarea: '1' }
	//console.log(req.params);
	//resultado de req.params = { id: '1' }
	const { id } = req.params;
	const resultado = await Tareas.destroy({ where: { id } });

	if (!resultado) return next();

	res.status(200).send('Tarea Eliminada desde tareasController.js');
};
