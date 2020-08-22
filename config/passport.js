const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Hacer referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propias
//en los parametros usernameField y passwordField  deben ser iguales al modelo
passport.use(
	new LocalStrategy(
		//por default passport espera usuario y password
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const usuario = await Usuarios.findOne({
					where: { email: email, activo: 1 },
				});
				//El usuario existe, password incorrecto
				if (!usuario.verificarPassword(password)) {
					return done(null, false, {
						message: 'Password Incorrecto',
					});
				}
				//El email existe y password correcto
				return done(null, usuario);
			} catch (error) {
				//ese usuario no existe
				return done(null, false, {
					message: 'Esa cuenta no existe',
				});
			}
		}
	)
);

//serializar el usuario
passport.serializeUser((usuario, callback) => {
	callback(null, usuario);
});

//desserializar el usuario
passport.deserializeUser((usuario, callback) => {
	callback(null, usuario);
});

//exportar
module.exports = passport;
