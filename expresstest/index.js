const express = require('express');
const app = express();
const port = 3000;
let hanged = 0;

app.get('/info', function (req, res) {
  console.log('info');
  res.send('info!');
})

app.get('/hang', function (req, res) {
  hanged ++;
  console.log(`hang request ${hanged}`);
  //res.send('info!');
})

app.get('/pause/:time', function (req, res) {
  const time = req.params.time;
  console.log(`pause ${time}`);
  setTimeout(() => {
      res.send(`pause ${time}`);
  }, time);

})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
})
