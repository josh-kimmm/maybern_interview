const roundToMoney = (float_number: number): number =>
  Math.round(float_number * 100) / 100;

export { roundToMoney };
