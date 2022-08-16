const mongoose = require('mongoose');
const Connections = require('../db/db-config')
const bcrypt = require('bcrypt');

const parseJSON = obj => JSON.parse(JSON.stringify(obj))

class Contenedor {
    constructor() {
        this.usuarios = mongoose.model('usuarios', {
            email: { type: String, required: true },
            nombre: { type: String, required: true },
            password: { type: String, required: true }
        });
    }

    async main() {
        await mongoose.connect(Connections.mongodbU.cnxStr, Connections.mongodbU.options);
    }

    async save(usuario) {
        // console.log(usuario);
		try {
            this.main();
            let userObject = {};
            
            const usuarioInfo = await this.usuarios.find({ 'email': usuario.email }, { __v: 0 });
            if (usuarioInfo.length < 1) {
                let salt = bcrypt.genSaltSync(10);
				let hash = bcrypt.hashSync(usuario.password, salt);
                userObject = {
                    email: usuario.email,
                    nombre: usuario.name,
                    password: hash
                };
                let doc = await this.usuarios.create(userObject);
                // console.log(doc)
                doc = parseJSON(doc)
                return userObject
            } else {
                return null;
            }
            
        } catch(error) {
            console.log(error)
            return undefined;
        }
	}

	async loginUser(usuario) {
		try {
            this.main();
            // console.log(usuario)
            const docs = await this.usuarios.findOne({ 'email': usuario.email }, { __v: 0 })
            // console.log(docs)
            // docs = docs.map(parseJSON);
            let hash = docs.password;
            // console.log(docs.password, usuario.password);
			let verify = bcrypt.compareSync(usuario.password, hash);
            // console.log(hash, usuario.password, verify)
			if (verify) {
                let info = {
                    email: docs.email,
                    nombre: docs.nombre
                }
                return info
            } else {
                return null
            }
            } catch (error) {
                return undefined
        }
	}

}

module.exports = Contenedor;