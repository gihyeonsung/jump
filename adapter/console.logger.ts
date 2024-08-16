import { Logger } from "../port";

export const consoleLogger: Logger = {
  info: async (s: string): Promise<void> => {
    console.log(new Date(), "info", s);
  },

  error: async (s: string): Promise<void> => {
    console.error(new Date(), "error", s);
  },
};
