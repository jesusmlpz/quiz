/**
 * @author Jesús
 */

// Importar modelo
var models = require('../models/models.js');

// Autoload: si la ruta incluye commentId acceder a la Base de Datos
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where : {
			id : Number(commentId)
		}
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error('Identificador de comentario "' + commentId + '" inválido.'));
		};
	}).catch(function(error) {
		next(error);
	});
};

exports.new = function(req, res) {
	res.render('comments/new', {
		quizId : req.params.quizId,
		errors : []
	});
};

exports.create = function(req, res) {
	var comment = models.Comment.build({
		texto : req.body.comment.texto,
		QuizId : req.params.quizId
	});

	// Validar los campos introducidos
	comment.validate()
	.then(
		function(err) {
			if (err) {
				res.render('comments/new', {
					comment : comment,
					quizId : req.params.quizId,
					errors : err.errors
					});
			} else{
				// guardar los campos pregunta y respuesta de quiz en la BD
				comment.save()
				.then(function() {res.redirect('/quizes/' + req.params.quizId);});
			};
		}
	);
};

// Publicar comentario
exports.publish = function (req, res) {
	req.comment.publicado = true;

		req.comment.save({
			fields : ['publicado']
		}).then(function() {
			res.redirect('/quizes/'+req.comment.QuizId);
		}).catch(function(error) {next(error);});
};
