export default {
  roundTo(value: number, step: number) {
    return Math.round(value / step) * step;
  },
};
