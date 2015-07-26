/**
 * @author Jesús
 */

// Importar modelo
var models = require('../models/models.js');

// Autoload: si la ruta incluye quizId acceder a la Base de Datos
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('Identificador de pregunta "' + quizId + '" inválido.'));
		};
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizes

exports.index = function(req, res) {
	var whereClause = {};
	
	if (req.query.search) {
		var search = '%' + req.query.search.replace(/[ ]+/g, '%') + '%';
		whereClause = {
			where: ["pregunta LIKE ?", search ],
			order: 'pregunta ASC'
		};
	}
	
	models.Quiz.findAll(whereClause).then(function(quizes) {
		res.render('quizes/index', {
			quizes : quizes
		});
	});
};

// GET /quizes/:quizId

exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz : req.quiz
	});
};

// GET /quizes/:quizId/answer

exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}

	res.render('quizes/answer', {
		quiz : req.quiz,
		respuesta : resultado
	});
};

// GET /author

exports.author = function(req, res) {
	res.render('author', {
		nombre : ['Jesús M. López', 'Lobo'],
		ciudad : ['Valencia', 'Valencia'],
		foto : ['/images/foto.jpeg', '/images/Lobo.jpeg']
	});
};

