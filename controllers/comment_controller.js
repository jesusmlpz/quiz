/**
 * @author Jesús
 */

// Importar modelo
var models = require('../models/models.js');

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

	err = comment.validate();

	if (err) {
		var j = 0;
		var errors = [];

		for (var i in err) {
			errors[j++] = err[i];
		}
		res.render('comments/new', {
			comment : comment,
			quizId : req.params.quizId,
			errors : errors
		});
	} else {
		// guardar los campos pregunta y respuesta de quiz en la BD
		comment
		.save()
		.then(function() {
			res.redirect('/quizes/' + req.params.quizId);
		});
	};

};
