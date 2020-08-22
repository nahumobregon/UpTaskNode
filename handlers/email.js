const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
	host: emailConfig.host,
	port: emailConfig.port,
	//secure: false, // true for 465, false for other ports
	auth: {
		user: emailConfig.user, // generated ethereal user
		pass: emailConfig.pass, // generated ethereal password
	},
});

//Generar Html ... nota: opciones : es un parametro tipo objeto
const generarHTML = (archivo, opciones = {}) => {
	const html = pug.renderFile(
		`${__dirname}/../views/emails/${archivo}.pug`,
		opciones
	);
	return juice(html);
};

// send mail with defined transport object
exports.enviar = async (opciones) => {
	const html = generarHTML(opciones.archivo, opciones);
	const text = htmlToText.fromString(html);
	let opcionesEmail = {
		from: '"UpTask 👻" <no-reply@nocsys.com.mx>', // sender address
		to: opciones.usuario.email, // list of receivers
		subject: opciones.subject, // Subject line
		text,
		html,
		//html: '<b>Estas reestableciendo tu password?</b>', // html body
	};

	//la siguiente linea se reemplaza
	//transport.sendMail(mailOptions);
	// por : , utilizando util  , que sirve para convertir una variable no asyncrona en asyncrona
	const enviarEmail = util.promisify(transport.sendMail, transport);
	return enviarEmail.call(transport, opcionesEmail);
};
