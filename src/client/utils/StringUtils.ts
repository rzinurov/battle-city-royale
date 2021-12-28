export default {
  randomString: (length: number) =>
    (Math.random() + 1).toString(36).substring(length),

  pad: (n: number) => (n < 10 ? `0${n}` : `${n}`),
};
