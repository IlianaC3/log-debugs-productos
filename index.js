//Config Inicial
require('dotenv').config();
const http = require('http');
const cluster = require('cluster');
const express = require('express');
const os = require('os');
const app = express();
const server = http.createServer(app);
const util = require('util');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const logger = require('./logger')

//Socket
const { Server } = require("socket.io");
const io = new Server(server);

const passport = require('./functions/passport')

//PUERTO
const minimist = require('minimist');
const minimistArg = minimist(process.argv, { alias: {'p': 'port'}});
const port = minimistArg.port || process.env.PORT || 3000;
const mode = process.env.MODE || 'FORK';

//Configuracion PID
const numeroCpus = os.cpus().length;
const processId = process.pid;
const isMaster = cluster.isMaster;
console.log(isMaster, mode);

//DB y Clases
const { mysql, mongoAtlas } = require('./db/db-config')
const Productos = require('./classes/Productos');
const ChatNorm = require('./classes/ChatNormalizr');
const Producto = new Productos(mysql);
const ChatNormalizr = new ChatNorm();

//Normalizer
const normalizr = require('normalizr');

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())

//SESSION
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: true,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		maxAge: 600000
	}
 }))

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('authentication'), (req, res) => {
   logger.info('Autorización login')
   let msg = '';
   if(req.user.email === -1) {
      msg = 'Usuario no existe';
      req.logout(function(err) {
         if (err) { return next(err); }
         res.render('error', {data: msg});
      });
   } else if (req.user.email === 0) {
      msg = 'Contraseña incorrecta';
      req.logout(function(err) {
         if (err) { return next(err); }
         res.render('error', {data: msg});
      });
   } else {
      res.redirect('/');
   }

})
app.post('/signup', passport.authenticate('registration'), (req, res) => {
   logger.info('Resgistro usuario')
   let msg = '';
   if(req.user.data === -1) {
      msg = 'No se pudo crear el usuario'
      req.logout(function(err) {
         if (err) { return next(err); }
         res.render('error', {data: msg});
       });
      
   } else if (req.user.data === 0) {
      msg = 'Usuario ya existe'
      req.logout(function(err) {
         if (err) { return next(err); }
         res.render('error', { data: msg });
      });
   } else {
      // console.log(req.user)
      msg = req.user.data;
      req.logout(function(err) {
         if (err) { return next(err); }
         res.render('success', { data: msg });
      })
   }
})

const routes_info = require('./routes/routes_info');
app.use('/random', routes_info)

const routes_back = require('./routes/routes_back');
app.use("/api/productos", routes_back);

const routes_faker = require('./routes/routes_faker');
app.use("/api/productos-test", routes_faker);

const routes_front = require('./routes/routes_front');
app.use('', routes_front)

app.set('view engine', 'ejs');
app.set('views', 'public');

io.on('connection', function(socket) {
   const ProductosConst = Producto.getAll().then(result => {
      logger.info('Petición inical de productos')
      if (result !== undefined) {
         return socket.emit('listProducts', result);
      } else {
         logger.error('No existen productos')
         return socket.emit('listProducts', []);
      }
   });

   const ChatConstN = ChatNormalizr.getAll().then(res => {
      logger.info('Lista de chats')
      if (res.includes('Error al listar todo')) {
         logger.error('No se pueden listar los chats');
         return socket.emit('listMessages', []);
      } else {
         let chatArr = {
            "id": 0,
            "mensajes": res
         }
         const autoresSchema = new normalizr.schema.Entity('autor', {}, {idAttribute: 'id'});
         const chatsSchema = new normalizr.schema.Entity('mensajes', {
            autor: autoresSchema
         }, {idAttribute: 'id'});
      
         let result = normalizr.normalize(chatArr, chatsSchema);
   
         return socket.emit('listMessages', result);
      }
      
   });
   ProductosConst;
   ChatConstN;
   

   socket.on('messages', data => {
      logger.info('Envía mensaje')
      const ChatSave = ChatNormalizr.save(data).then(result => {
         if (result.includes("Error al leer archivo")) {
            logger.error('No se pudo guardar el mensaje')
         } else {
            const ChatConstN2 = ChatNormalizr.getAll().then(res => {
               let chatArr = {
                  "id": 0,
                  "mensajes": res
               }
               const autoresSchema = new normalizr.schema.Entity('autor');
               const chatsSchema = new normalizr.schema.Entity('mensajes', {
                  autor: autoresSchema
               });
            
               let result = normalizr.normalize(chatArr, chatsSchema);
               // console.log(result)
                return socket.emit('listMessages', result);
               
            });
         }
         
      });
   });

   //Guardar productos
   socket.on('newProduct', data => {
      logger.info('Envía producto')
      const ProductosSave = Producto.save(data).then(result => {
         if (result.includes('No se pudo guardar el producto')) {
            logger.error('No se pudo guardar el archivo');
         } else {
            const ProductosConst2 = Producto.getAll().then(result => {
               if (result !== undefined) {
                  return socket.emit('listProducts', result);
               } else {
                  logger.error(`No existen productos`)
                  return socket.emit('listProducts', []);
               }
            });
         }

     });
   });

});

if (cluster.isMaster && mode === 'CLUSTER') {
   for (let i = 0; i < numeroCpus; i++) {
     cluster.fork();
   }
   cluster.on('exit', (worker) => {
     console.log(`Proceso worker con PID ${worker.process.pid} salio`);
   });
} else {
   server.listen(port, () => {
      console.log(`Servidor express - Puerto ${port} - PID ${processId} - Fecha y hora ${(new Date().toLocaleString())}`);
   });
}