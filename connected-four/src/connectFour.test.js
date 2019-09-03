import { ConnectFour } from './connectFour';

test('vertical red', () => {
  let connectFour = new ConnectFour();
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(1, 'B')).toBe(undefined);
  expect(connectFour.play(2, 'B')).toBe(undefined);
  expect(connectFour.play(3, 'R')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe('R');
});

test('missing one to vertical red', () => {
  let connectFour = new ConnectFour();
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(1, 'B')).toBe(undefined);
  expect(connectFour.play(2, 'B')).toBe(undefined);
  expect(connectFour.play(3, 'R')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe(undefined);
});

test('horizontal blue', () => {
  let connectFour = new ConnectFour();
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(1, 'B')).toBe(undefined);
  expect(connectFour.play(2, 'B')).toBe(undefined);
  expect(connectFour.play(3, 'B')).toBe(undefined);
  expect(connectFour.play(5, 'R')).toBe(undefined);
  expect(connectFour.play(4, 'B')).toBe('B');
});

test('missing one to horizontal blue', () => {
  
  let connectFour = new ConnectFour();
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(1, 'B')).toBe(undefined);
  expect(connectFour.play(2, 'B')).toBe(undefined);
  expect(connectFour.play(4, 'R')).toBe(undefined);
  expect(connectFour.play(3, 'B')).toBe(undefined);
});

test('horizontal blue', () => {
  let connectFour = new ConnectFour();
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(1, 'B')).toBe(undefined);
  expect(connectFour.play(6, 'R')).toBe(undefined);
  expect(connectFour.play(2, 'B')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(4, 'B')).toBe(undefined);
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(3, 'B')).toBe('B');
});

test('horizontal red', () => {
  let connectFour = new ConnectFour();
  expect(connectFour.play(0, 'R')).toBe(undefined);
  expect(connectFour.play(0, 'B')).toBe(undefined);
  expect(connectFour.play(1, 'R')).toBe(undefined);
  expect(connectFour.play(1, 'B')).toBe(undefined);
  expect(connectFour.play(3, 'R')).toBe(undefined);
  expect(connectFour.play(3, 'B')).toBe(undefined);
  expect(connectFour.play(2, 'R')).toBe('R');
});