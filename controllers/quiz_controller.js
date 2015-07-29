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
			quizes : quizes,
			errors : []
		});
	});
};

// GET /quizes/:quizId

exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz : req.quiz,
		errors : []
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
		respuesta : resultado,
		errors : []
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
		quiz : quiz,
		errors : []
	});
};

// POST /quizes/create

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	// Validar los campos introducidos

	//quiz.validate().then(function(err) {
	err = quiz.validate();

	if (err) {
		var j = 0;
		var errors = [];

		for (var i in err) {
			errors[j++] = err[i];
		}
		res.render('quizes/new', {
			quiz : quiz,
			errors : errors
		});
	} else {
		// guardar los campos pregunta y respuesta de quiz en la BD
		quiz.save({
			fields : ['pregunta', 'respuesta']
		}).then(function() {
			res.redirect('/quizes');
		});
	};
	//});
};

// GET /quizes/:quizId/edit

exports.edit = function(req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {
		quiz : quiz,
		errors : []
	});
};

// PUT /quizes/:quizId

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	err = req.quiz.validate();
	if (err) {
		var j = 0;
		var errors = [];

		for (var i in err) {
			errors[j++] = err[i];
		}
		res.render('quizes/edit', {
			quiz : req.quiz,
			errors : errors
		});
	} else {
		req.quiz.save({fields: ['pregunta','respuesta']})
		.then(function(){res.redirect('/quizes');});
	};
};

// DELETE /quizes/:quizId
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error);});
};

// GET /author

exports.author = function(req, res) {
	res.render('author', {
		nombre : ['Jesús M. López', 'Lobo'],
		ciudad : ['Valencia', 'Valencia'],
		foto : ['/images/foto.jpeg', '/images/Lobo.jpeg'],
		errors : []
	});
};

