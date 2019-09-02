import { matchWon } from './connectFour';

test('vertical red', () => {
  expect(matchWon([])).toBe(false);
});