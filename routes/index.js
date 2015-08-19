var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');

/* GET home page. */
router.get('/', function(req, res) {
	var errors = req.session.errors || [];
	res.render('index', { title: 'Quiz', errors: errors });
});

// Autoload de comandos con quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// Definición de rutas de quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);
// Ruta de control de estadísticas
router.get('/quizes/statistics', statisticsController.show);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comment/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comment', commentController.create);
router.put('/quizes/:quizId(\\d+)/comment/:commentId(\\d+)', sessionController.loginRequired, commentController.publish);

// Rutas de control de sesiones
router.get('/login', sessionController.new);		// formulario de login
router.post('/login', sessionController.create);	// crear sesión
router.get('/logout', sessionController.destroy);	// cerrar sesión

router.get('/author', quizController.author);

module.exports = router;
