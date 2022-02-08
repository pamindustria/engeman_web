const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

// permito que a aplicação web tenha acesso as minhas API's
app.use(cors());
// formata e transforma os dados para o formato de objeto javascript
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('./dist/tela-gerencial/'));

app.get('/', (request, response) => response.sendFile('./dist/tela-gerencial/index.html'));

app.listen(port, '0.0.0.0', () => console.info(`Servidor rodando na porta: ${port}`));