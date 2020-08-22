const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env' });

//helpers con algunas funciones
const helpers = require('./helpers');

//crear la conexion a la base de datos
const db = require('./config/db');

/*
db.authenticate()
	.then(() => console.log('Conectado a MySql'))
	.catch((error) => console.log(error));
//lo anterior solamente hace la conexion
*/

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// sync , crea la tabla en mysql en automático, en base al modelo
db.sync()
	.then(() => console.log('Conectado a MySql'))
	.catch((error) => console.log(error));

//crear la app de express
const app = express();

//configurar carpeta de archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Habilitar el bodyParser para leer los datos del formulario, ejemplo nuevoproyecto
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

//Agregamos express validator a toda la aplicacion
//app.use(expressValidator());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());
//sesiones, nos permiten navegar entre distintas paginas
//sin volvernos a autenticar
app.use(
	session({
		secret: 'Nhm27noc$.',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

//pasar var dump a la aplicacion
//lo siguiente es un middleware
app.use((req, res, next) => {
	//todo lo referente al usuario se almacena en req.user
	//console.log(req.user);
	res.locals.usuario = { ...req.user } || null;
	//console.log(res.locals.usuario);
	//{} en caso de no estar logeado

	//res.locals sirve para crer variables que se puedan consumir en todo el royecto
	//en este caso, crea la variable vardump y le asigna el valor en helpers.vardump
	res.locals.vardump = helpers.vardump;

	//los mensajes del request los hacemos globales
	res.locals.mensajes = req.flash();
	//next  sirve para garantizar que pase a la siguiente línea o middleware
	next();
});

//aprendiendo middleware
/*
app.use((req, res, next) => {
	console.log('Yo soy middleware');
	next();
});

app.use((req, res, next) => {
	console.log('Yo soy otro middleware');
	next();
});
*/

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0'; // process.env.HOST => nuestro localhost
const port = process.env.PORT || 3000; // process.env.PORT => PUERTO DE HEROKU

//app.listen(3000);
app.listen(port, host, () => {
	console.log('El Servidor esta funcionando ');
});

// la siguiente linea es para probar el servicio de nodemailer y mailtrap
//require('./handlers/email');
