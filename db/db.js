
async function connectDB() {
   if (global.connection && global.connection.state !== 'disconnected') {
      return global.connection;
   }

   const mysql = require("mysql2/promise");
   const connection = await mysql.createConnection("mysql://b36051ff385f38:4c2ac879@us-cdbr-east-05.cleardb.net:3306/heroku_80e2ea22973feca")
   console.log('Conexao com banco feita com sucesso.');
   global.connection = connection;
   return connection;
}

// connectDB();

async function selectClients() {
   const conn = await connectDB();
   const [ rows ] = await conn.query('SELECT * FROM clients;');
   return rows;
}

async function selectCarts() {
   const conn = await connectDB();
   const [ rows ] = await conn.query('SELECT * FROM carts;');
   return rows;
}

async function selectEtiquetas() {
   const conn = await connectDB();
   const [ rows ] = await conn.query(
      'SELECT clients.id, clients.name, carts.id, carts.code FROM clients JOIN carts ON clients.id = carts.id;'
   );
   return rows;
}

module.exports = { selectClients, selectCarts, selectEtiquetas, connectDB }