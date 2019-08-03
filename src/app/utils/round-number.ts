export const roundNumber = (number: number, fpn?: number) => {
  const v = 10 ** (fpn !== null ? fpn : 0);
  return v > 0 ? Math.round(number * v) / v : Math.round(number);
};
