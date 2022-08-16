const mongoose = require('mongoose');
const Connections = require('../db/db-config')

const parseJSON = obj => JSON.parse(JSON.stringify(obj))

class Contenedor {
    constructor() {
        this.autor = mongoose.model('autor', {
            id: { type: String, required: true },
            nombre: { type: String, required: true },
            apellido: { type: String, required: true },
            edad: { type: Number, required: true },
            alias: { type: String, required: true },
            avatar: { type: String, required: true },
        });
        this.mensajes = mongoose.model('mensajes', {
            text: { type: String, required: true },
            timestamp: { type: Date, default: new Date(), required: true },
            autor: { type: {}, required: true }
        });
    }


    async main() {
        await mongoose.connect(Connections.mongodbU.cnxStr, Connections.mongodbU.options);
    }

    async save(chat) {
		try {
            this.main();
            let autorObject = {};
            const AutorInfo = await this.autor.find({ 'id': chat.autor.id }, { __v: 0 });
            if (AutorInfo.length > 0) {
                autorObject = {
                    id: chat.autor.id,
                    nombre: AutorInfo[0].nombre,
                    apellido: AutorInfo[0].apellido,
                    edad: AutorInfo[0].edad,
                    avatar: AutorInfo[0].avatar,
                    alias: AutorInfo[0].alias,
                }
            } else {
                autorObject = {
                    id: chat.autor.email,
                    nombre: chat.autor.nombre,
                    apellido: chat.autor.apellido,
                    edad: chat.autor.edad,
                    avatar: chat.autor.avatar,
                    alias: chat.autor.alias,
                }
                const SaveInfoAutor = await this.autor(autorObject);
            }
            let object = {
                text: chat.text,
                timestamp: new Date(),
                autor: autorObject
            }
            let doc = await this.mensajes.create(object);
            doc = parseJSON(doc)
            return "Mensaje guardado" + chat.text
        } catch(error) {
            return "Error al leer archivo" + error;
        }
	}

	async getAll() {
		try {
            this.main();
            let docs = await this.mensajes.find({}, { __v: 0 }).lean();
            // console.log(docs)
            docs = docs.map(parseJSON)
            return docs
            } catch (error) {
                return `Error al listar todo: ${error}`
        }
	}

}

module.exports = Contenedor;