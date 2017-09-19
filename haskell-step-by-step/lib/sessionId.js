const uuidv4 = require('uuid/v4');

const sessions = {

};

const newSession = () => {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    step : -1
  }
  return {
    id : sessionId,
    session : sessions[sessionId]
  };
};

const getCurrentStep = (sessionId) => {
  const session = Object.keys(sessions).find((el) => {
    return el === sessionId;
  });

  console.log('getCurrentStep', sessions, session);

  if (session) {
    return sessions[session].step;
  } else {
    return undefined;
  }
};

module.exports = {
  newSession,
  getCurrentStep
};
