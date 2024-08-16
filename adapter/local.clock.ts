import { Clock } from "../port";

export const localClock: Clock = {
  now: async (): Promise<number> => Math.floor(Date.now() / 1000),
};
