const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const app = express();

// permito que a aplicação web tenha acesso as minhas API's
app.use(cors());
// formata e transforma os dados para o formato de objeto javascript
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('./dist/tela-gerencial/'));

//a aplicação roda a partir daqui
app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,'dist/tela-gerencial/index.html'));
});

app.listen(port, '0.0.0.0', () => console.info(`Servidor rodando na porta: ${port}`));