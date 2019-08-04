export const average = (arr: number[]) => {
  const sum: number = arr.reduce((acc, value) => acc + value, 0);
  return sum / arr.length;
};
