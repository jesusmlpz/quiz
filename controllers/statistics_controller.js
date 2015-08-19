/**
 * @author Jesús
 */

// Importar modelo
var models = require('../models/models.js');

exports.show = function(req, res) {
	var statistics = {
		quizesNum : 0,
		commentsNum : 0,
		commentsPerQuiz : 0.0,
		quizesWithComment : 0,
		quizesWithoutComment : 0
	};
	
	// Número de preguntas
	models.Quiz.count().then(function(c){
		statistics.quizesNum = c;
	}).catch(function(error) {
		req.session.errors = [error];
		res.redirect('/');
//		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior
	});
	
	// Número de comentarios
	models.Comment.count().then(function(c){
		statistics.commentsNum = c;
		// Número medio de comentarios por pregunta
		statistics.commentsPerQuiz = (statistics.commentsNum / statistics.quizesNum).toFixed(1);
	}).catch(function(error) {
		req.session.errors = [error];
		res.redirect('/');
//		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior
	});
	
	// Número de preguntas con comentario
	models.Comment.count({
		group: '"QuizId"'
	})
	.then(function(c) {
		statistics.quizesWithComment = c.length;
		statistics.quizesWithoutComment = statistics.quizesNum - statistics.quizesWithComment;
		res.render('quizes/statistics', {
			statistics: statistics,
			errors : []
		});
	}).catch(function(error) {
		req.session.errors = [error];
		res.redirect('/');
//		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior
	}); 

};