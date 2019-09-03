import { ConnectFour } from './connectFour';

test('vertical red', () => {
  console.log(ConnectFour);
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(2, 'B');
  connectFour.play(3, 'R');
  connectFour.play(0, 'R');
  connectFour.play(0, 'R');
  connectFour.play(0, 'R');

  expect(connectFour.matchWon(2, 0)).toBe('R');
});

test('missing one to vertical red', () => {
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(2, 'B');
  connectFour.play(3, 'R');
  connectFour.play(0, 'R');
  connectFour.play(0, 'R');

  expect(connectFour.matchWon(2, 0)).toBe(undefined);
});

test('horizontal blue', () => {
  console.log(ConnectFour);
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(2, 'B');
  connectFour.play(3, 'B');
  connectFour.play(4, 'B');
  connectFour.play(5, 'R');

  expect(connectFour.matchWon(5, 0)).toBe('B');
});

test('missing one to horizontal blue', () => {
  
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(2, 'B');
  connectFour.play(3, 'B');
  connectFour.play(4, 'R');

  expect(connectFour.matchWon(5, 0)).toBe(undefined);
});