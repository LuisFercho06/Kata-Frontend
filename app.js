//imports
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const http = require('http');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

//ruta
app.get('/trivia/colombia', async (req, res) => {
  //parametros
  const { dificultad, tipo, categoria } = req.query;
  //comprobador de que los parametros llegaron bien y se pueden usar
  if (dificultad && tipo && categoria) {
    //intente si...
    try {
      const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoria}&difficulty=${dificultad}&type=${tipo}`;
      const response = await axios.post(apiUrl);

      //const htmlResponse = `<html><body><table border="1">
      //                      <tr><th>Pregunta</th><th>Respuesta</th></tr>
      //                      ${response.data.results.map(result => `<tr><td>${result.question}</td><td>${result.correct_answer}</td></tr>`).join('')}
      //                      </table></body></html>`;
      const results = response.data.results;

      //res.send(htmlResponse);
      const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
                console.error(err);
            } else {
                const renderedHtml = ejs.render(data, { questions: results });
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(renderedHtml);
            }
        });
        //... y si no...
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener datos desde la API.');
    }
    // si no estan ...
  } else {
    res.status(400).send('Por favor, proporciona los parámetros de dificultad, tipo y categoría en la URL.');
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});