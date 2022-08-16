const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../classes/Usuarios');
const Usuario = new Usuarios();

passport.use('registration', new LocalStrategy((username, password, callback) => {
    let usuario = {
		email: username,
		password: password,
		name: username.split('@')[0]
	}
	Usuario.save(usuario).then((result) => {
		// console.log(result);
		if (result === undefined) {
			callback(null, { data: -1 });
		} else if(result === null) {
			callback(null, { data: 0 });
		} else {
			callback(null, { data: usuario.email } );
		}
	});
}));

passport.use('authentication', new LocalStrategy((username, password, callback) => {
    let usuario = {
		email: username,
		password: password
	}
    Usuario.loginUser(usuario).then((result) => {
		// console.log(result)
        if (result === undefined) {
			callback(null, { email: -1 });
		} else if (result === null) {
			callback(null, { email: 0 });
		} else {
			callback(null, result)
		}
    });
}));

passport.serializeUser((usuario, callback) => {
	// console.log("usuario", usuario)
  	callback(null, usuario);
});

passport.deserializeUser((username, callback) => {
//   console.log("username", username)
  callback(null, username);
});

module.exports = passport;