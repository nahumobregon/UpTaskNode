const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
	//res.send('funciona');
	res.render('crearCuenta', {
		nombrePagina: 'Crear Cuenta UpTask',
	});
};

exports.formIniciarSesion = (req, res) => {
	//console.log(req.flash());
	//console.log(res.locals.mensajes);
	const { error } = res.locals.mensajes;
	//res.send('funciona');
	res.render('iniciarSesion', {
		nombrePagina: 'Iniciar Sesion UpTask',
		error,
	});
};

exports.crearCuenta = async (req, res) => {
	//res.send('enviaste el form');
	console.log(req.body);
	//leer los datos
	const { email, password } = req.body;
	try {
		await Usuarios.create({
			email,
			password,
		});

		//crear una URL de confirmar
		const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

		//crear el objeto de usuario
		const usuario = {
			email,
		};

		//enviar email
		await enviarEmail.enviar({
			usuario,
			subject: 'Confirma tu cuenta ',
			confirmarUrl,
			archivo: 'confirmar-cuenta',
		});

		//redirigir al usuario
		req.flash('correcto', 'Enviamos un correo para confirmar tu cuenta');
		res.redirect('/iniciar-sesion');
	} catch (error) {
		//pocao antes de mosyrar la vista
		req.flash(
			'error',
			error.errors.map((error) => error.message)
		);
		res.render('crearCuenta', {
			mensajes: req.flash(),
			nombrePagina: 'Crear Cuenta en Up Task',
			email: email,
			password: password,
		});
		//console.log(errores);
	}

	//ejemplo de crear el usuario, afuera del try catch
	//Usuarios.create({
	//	email,
	//	password,
	//}).then(() => {
	//	res.redirect('/iniciar-sesion');
	//});
};

exports.formReestablecerPassword = (req, res) => {
	res.render('reestablecer', {
		nombrePagina: 'Reestablecer tu Password',
	});
};

exports.confirmarCuenta = async (req, res) => {
	//console.log(req.params);
	//res.json(req.params.email);
	const usuario = await Usuarios.findOne({
		where: {
			email: req.params.email,
		},
	});

	//si no existe el usuario
	if (!usuario) {
		req.flash('error', 'No valido');
		res.redirect('/crear-cuenta');
	}

	console.log(usuario);
	usuario.activo = 1;
	await usuario.save();

	req.flash('correcto', 'Cuenta Activada Correctamente');
	res.redirect('/iniciar-sesion');
};
