const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(
   bodyParser.urlencoded({
      extended: true
   })
);
db.connectDB();
   
app.get('/', (req, res) => {
   res.json({'message': 'ok'});
});

app.get('/engeman/get/etiquetas', async (req, res) => {
   const etiquetas = await db.selectEtiquetas();
   res.json(etiquetas);
});



// (async () => {
//    console.log('select etiquetas');
//    const etiquetas = await db.selectEtiquetas();
//    console.log(etiquetas);
//    app.get('/etiquetas', (req, res) => {
//       res.json(etiquetas);
//    });
// })();

app.listen(port, () => {
   console.log(`Ouvindo em http://localhost:${port}`);
});