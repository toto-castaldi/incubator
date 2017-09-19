(async () => {

  let match = await (await fetch('/api/match', { method: "POST", body: JSON.stringify({})})).json();
  console.log(match);
  let challenge = await (await fetch('/api/challenge', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}, method: "POST", body: JSON.stringify(match)})).json();
  console.log(challenge);


})();
