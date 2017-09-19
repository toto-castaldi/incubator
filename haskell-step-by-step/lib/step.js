const steps = [
  {
    question : "qual'è il comune di 'Paolino Paperino' ?"
  }
];

const nextStep = (stepNumber) => {
  if (steps.length <= stepNumber) return undefined;
  return steps[stepNumber + 1];
};

const areStepsAvailable = (stepNumber) => {
  console.log(stepNumber , steps.length);
  return stepNumber < steps.length;
};

module.exports = {
  areStepsAvailable,
  nextStep
};
