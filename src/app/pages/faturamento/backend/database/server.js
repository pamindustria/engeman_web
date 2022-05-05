const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('./dboperations');
const port = 8001;
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
   console.log("Conexão com o banco DADOSADV bem sucedida");
})
   .catch((error) => {
      console.log(error);
   });

router.route('/getLista').get((request, response) => {
   db.getOrdXFunc().then((data) => {
      response.json(data.recordset);
   });
});

app.listen(port, () => console.info(`Servidor rodando na porta: ${port}`));