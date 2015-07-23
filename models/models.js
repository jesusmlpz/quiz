/**
 * @author Jesús
 */

var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar Base de Datos SQLite
var sequelize = new Sequelize(null, null, null, {
	dialect : 'sqlite',
	storage : 'quiz.sqlite'
});

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;

// Inicializar todas las tablas de la BD
sequelize.sync().success(function() {
	// Crear un registro si la tabla está vacía
	Quiz.count().success(function(count) {
		if (count === 0) {
			Quiz.create({
				pregunta : 'Capital de Italia',
				respuesta : 'Roma'
			}).success(function() {
				console.log('Base de Datos inicializada');
			});
		};
	});
});
