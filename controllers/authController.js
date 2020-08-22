const passport = require('passport');
const Usuarios = require('../models/Usuarios');

//importar operadores de sequelize
//const Sequelize = require('sequelize');
const { Sequelize } = require('../config/db');
const Op = Sequelize.Op;

//importar para generar un token
const crypto = require('crypto');

//importar para hashear el password
const bcrypt = require('bcrypt-nodejs');

const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true,
	badRequestMessage: 'Ambos campos son Obligatorios',
});

//funcion para revisar si el usuario esta i no autenticado
exports.usuarioAutenticado = (req, res, next) => {
	//si el usuario esta autenticado
	if (req.isAuthenticated()) {
		return next();
	}
	//si el usuario no esta autenticado, redirigir a autenticarse
	return res.redirect('/iniciar-sesion');
};

//funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/iniciar-sesion');
	});
};

//genera un token si el susuario es valido
exports.enviarToken = async (req, res) => {
	//const {email} = req.body
	const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

	//si no existe el usuario
	if (!usuario) {
		req.flash('error', 'No existe esa cuenta');
		//res.render('reestablecer', {
		//	nombrePagina: 'Reestablecer tu password',
		//	mensajes: req.flash(),
		//});
		res.redirect('/reestablecer');
	}

	//usuario existe
	usuario.token = crypto.randomBytes(20).toString('hex');
	//console.log(token);
	//expiracion
	usuario.expiracion = Date.now() + 360000;
	//console.log(expiracion);

	//guardar en la base de datos
	await usuario.save();

	//url de reset
	const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
	//console.log('variable resetUrl :');
	//console.log(resetUrl);

	//Enviar el correo con el token
	await enviarEmail.enviar({
		usuario,
		subject: 'Password Reset',
		resetUrl,
		archivo: 'reestablecer-password',
	});

	//terminar , para que no se quede pensando la url
	req.flash('correcto', 'se envio un mensaje a tu correo');
	res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
	//res.json(req.params.token);
	const usuario = await Usuarios.findOne({
		where: {
			token: req.params.token,
		},
	});
	console.log('desde exports.validarToken :');
	console.log(usuario);

	//si no encuentra el usuario
	if (!usuario) {
		req.flash('error', 'no valido');
		res.redirect('/reestablecer');
	}

	//Formulario para generar el password
	res.render('resetPassword', {
		nombrePagina: 'Reestablecer Contraseña',
	});
};

//cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
	//console.log(req.params.token);

	//verifica que el token sea valido y tambien la fecha de expiracion
	const usuario = await Usuarios.findOne({
		where: {
			token: req.params.token,
			expiracion: {
				[Op.gte]: Date.now(),
			},
		},
	});

	//verificamos si el usuario existe
	//console.log(usuario);
	if (!usuario) {
		req.flash('error', 'No es valido, o ya expiró el token');
		res.redirect('/reestablecer');
	}

	//console.log('Usuario antes de hashear el nuevo password');
	//console.log(usuario);
	//hashear el nuevo password
	usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	usuario.token = null;
	usuario.expiracion = null;

	//console.log('Usuario despues de hashear el nuevo password');
	//console.log(usuario);

	//guardamos el nuevo password
	await usuario.save();
	req.flash('Correcto', 'Tu password se ha modificado correctamente');
	res.redirect('/iniciar-sesion');
};
