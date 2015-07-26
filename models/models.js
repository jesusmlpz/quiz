/**
 * @author Jesús
 */

var path = require('path');

// Postgres:	DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite:		DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = url[6];
var user = url[2];
var pwd = url[3];
var host = url[4];
var port = url[5];
var protocol = url[1];
var dialect = url[1];
var storage = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar Base de Datos SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{
		dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage,	// solo SQLite (.env)
		omitNull: true		// solo Postgres
	});
	
//var sequelize = new Sequelize(null, null, null, {
//	dialect : 'sqlite',
//	storage : 'quiz.sqlite'
//});

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;

// Inicializar todas las tablas de la BD
sequelize.sync().then(function() {
	// Crear un registro si la tabla está vacía
	Quiz.count().then(function(count) {
		if (count === 0) {
			Quiz.create({ pregunta : 'Capital de Italia', respuesta : 'Roma'});
			Quiz.create({ pregunta : 'Capital de Portugal', respuesta : 'Lisboa'})
			.then(function() {console.log('Base de Datos inicializada');});
		};
	});
});
