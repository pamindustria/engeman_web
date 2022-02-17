const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('./dboperations');
const port = 8000;
const config = require('./dbconfig');
const sql = require('mssql');

const app = express();

// permito que a aplicação web tenha acesso as minhas API's
app.use(cors());
// formata e transforma os dados para o formato de objeto javascript
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

//database
sql.connect(config).then(() => {
      console.log("Conexão com o banco bem sucedida");
   })
   .catch((error) => {
      console.log(error);
   });

// para engeman web
router.route('/getOS').get((request, response) => {
   db.getOrdXFunc().then((data) => {
      response.json(data.recordset);
   });
});

// para engeman app

app.get('/getOSabertas/:codigo', (request, response) => {
   const codigo = request.params.codigo;

   db.getOrdServ(codigo).then((data) => {
      response.json(data.recordset);
   });
}); 

app.get('/getFuncionario/:tag', (request, response) => {
   const matricula = request.params.tag;

   db.getFunc(matricula).then((data) => {
      response.json(data.recordset);
   });
}); 

app.listen(port, () => console.info(`Servidor rodando na porta: ${port}`));