export type Clock = {
  now: () => Promise<number>;
};
