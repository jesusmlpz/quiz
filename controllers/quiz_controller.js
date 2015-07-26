/**
 * @author Jesús
 */

// Importar modelo
var models = require('../models/models.js');

// GET /quizes

exports.index = function(req, res) {
	models.Quiz.findAll().success(function(quizes) {
		res.render('quizes/index', {quizes : quizes});
	});	
};

// GET /quizes/:quizId

exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz : quiz});
	});
};

// GET /quizes/:quizId/answer

exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).success(function(quiz) {
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer',
				{quiz: quiz, respuesta : 'Correcto'});
		} else {
			res.render('quizes/answer',
				{quiz: quiz, respuesta : 'Incorrecto'});
		};
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

