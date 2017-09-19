const express = require('express');
const app = express();
const sessionId = require('./lib/sessionId');
const step = require('./lib/step');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/match', (req, res) => {
  const session = sessionId.newSession();
  res.send(session);
});

app.post('/api/challenge', (req, res) => {
  let {id} = req.body;

  console.log('requet', req.body, id);

  const stepNumber = sessionId.getCurrentStep(id);

  console.log('current step', stepNumber);

  const areStepsAvailable = step.areStepsAvailable(stepNumber);

  console.log('areStepsAvailable', areStepsAvailable);

  if(!areStepsAvailable) {
    return res.status(400).send({error: 'no steps'});
  }

  const nextStep = step.nextStep(stepNumber);

  console.log('nextStep', nextStep);

  res.send({
    id,
    step : nextStep
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
