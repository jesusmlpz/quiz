/**
 * @author Jesús
 */

// Importar modelo
var models = require('../models/models.js');

exports.show = function(req, res) {
	var whereClause = {};
	req.statistics = {
		quizesNum : 0,
		commentsNum : 0,
		commentsPerQuiz : 0.0,
		quizesWithComment : 0,
		quizesWithoutComment : 0
	};
	
	// Número de preguntas
	models.Quiz.count().then(function(c){
		req.statistics.quizesNum = c;
	}).catch(function(error) {
		console.log("Error contando Quizes: " + JSON.stringify(error));
		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior
	});
	
	// Número de comentarios
	models.Comment.count().then(function(c){
		req.statistics.commentsNum = c;
		// Número medio de comentarios por pregunta
		req.statistics.commentsPerQuiz = req.statistics.commentsNum * 1.0 / req.statistics.quizesNum;
	}).catch(function(error) {
		console.log("Error contando Comments: " + JSON.stringify(error));
		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior
	});
	
	
	// Número de preguntas con comentario0
/*	models.Quiz.count({
		include: [{
			model: models.Comment,
			required: true,
			attributes: ['QuizId']
		}],*/
	models.Comment.count({
		attributes: ['QuizId'],
		group: 'QuizId'
//		distinct: true
	}).then(function(c) {
		req.statistics.quizesWithComment = c;
		req.statistics.quizesWithoutComment = req.statistics.quizesNum - req.statistics.quizesWithComment;
		console.log('statistics=' + JSON.stringify(req.statistics));
		res.render('quizes/statistics', {
			quizesNum : req.statistics.quizesNum,
			commentsNum : req.statistics.commentsNum,
			commentsPerQuiz : req.statistics.commentsPerQuiz.toFixed(1),
			quizesWithComment : req.statistics.quizesWithComment,
			quizesWithoutComment : req.statistics.quizesWithoutComment,
			errors : []
		});
	}).catch(function(error) {
		console.log("Error contando Quizes con Comment: " + JSON.stringify(error));
		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior
	}); 

};