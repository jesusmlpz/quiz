/**
 * @author Jesús
 */

// Formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || [];
	req.session.errors = {};
	 
	res.render('sessions/new', {errors: errors});
};

// Crear sesión
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	
	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) {
			//req.session.errors = [{message: 'Se ha producido un error: '+error.message}];
			req.session.errors = ['Se ha producido un error: '+error.message];
			res.redirect('/login');
			return;
		};
		
		// Crear req.session.user y guardar campos "id" y "username"
		// La sesión se define por la existencia de req.session.user
		req.session.user = {id: user.id, username: user.username};
		
//		res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior al login
		console.log('req.app.locals.redir: '+JSON.stringify(req.app.locals.redir));
		res.redirect(req.app.locals.redir.toString());	// redireccionar a la vista anterior al login
	});	
};

// Comprobar que hay sesión activa
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	};
};

// Cerrar sesión
exports.destroy = function(req, res) {
	delete req.session.user;
	
//	res.redirect(req.session.redir.toString());	// redireccionar a la vista anterior al logout
	console.log('req.app.locals.redir: '+JSON.stringify(req.app.locals.redir));
	res.redirect(req.app.locals.redir.toString());	// redireccionar a la vista anterior al logout

};
