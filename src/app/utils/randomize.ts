import { roundNumber } from './round-number';

export const randomize = (value: number): number => {
  const rnd = roundNumber(Math.random(), 2) * 100;
  const sin = (roundNumber(Math.random(), 1) * 10) % 2 ? -1 : 1;
  return value + sin * rnd;
};
