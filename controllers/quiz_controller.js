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
			where : ["pregunta LIKE ?", search],
			order : 'pregunta ASC'
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

// GET /quizes/new

exports.new = function(req, res) {
	var quiz = models.Quiz.build(// crea objeto quiz
	{
		pregunta : 'Pregunta',
		respuesta : 'Respuesta'
	});

	res.render('quizes/new', {
		quiz : quiz
	});
};

// POST /quizes/create

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	// guardar los campos pregunta y respuesta de quiz en la BD
	quiz.save({
		fields: ['pregunta', 'respuesta']
	}).then(function() {
		res.redirect('/quizes');
	});
	//res.redirect('/quizes');
};

// GET /author

exports.author = function(req, res) {
	res.render('author', {
		nombre : ['Jesús M. López', 'Lobo'],
		ciudad : ['Valencia', 'Valencia'],
		foto : ['/images/foto.jpeg', '/images/Lobo.jpeg']
	});
};

