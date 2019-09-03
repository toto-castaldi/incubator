import { ConnectFour } from './connectFour';

test('vertical red', () => {
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
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(2, 'B');
  connectFour.play(3, 'B');
  connectFour.play(5, 'R');
  connectFour.play(4, 'B');

  expect(connectFour.matchWon(5, 4)).toBe('B');
});

test('missing one to horizontal blue', () => {
  
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(2, 'B');
  connectFour.play(4, 'R');
  connectFour.play(3, 'B');

  expect(connectFour.matchWon(5, 3)).toBe(undefined);
});

test('horizontal blue', () => {
  let connectFour = new ConnectFour();
  connectFour.play(0, 'R');
  connectFour.play(1, 'B');
  connectFour.play(6, 'R');
  connectFour.play(2, 'B');
  connectFour.play(0, 'R');
  connectFour.play(4, 'B');
  connectFour.play(0, 'R');
  connectFour.play(3, 'B');

  expect(connectFour.matchWon(5, 3)).toBe('B');
});