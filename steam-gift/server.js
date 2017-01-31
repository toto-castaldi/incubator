const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/gift-info', (req, res) => {
  const email = req.body.email;
  console.log(`gift email`, email, req.body );

  if (email) {
    fs.appendFile('emails.txt', email + '\n', (err) => {
      if (!err) {
        const filePath = __dirname + '/public/' + 'greetings.html';

        if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
        } else {
          res.statusCode = 404;
          res.write('404 sorry not found');
          res.end();
        }
      } else {
        console.error(err);
        res.statusCode = 500;
        res.write('500 can\'t record email');
        res.end();
      }
    });
  } else {
    console.error(err);
    res.statusCode = 500;
    res.write('500 can\'t record email');
    res.end();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

//for DOCKER
process.on('SIGINT', () => {
  process.exit();
});
