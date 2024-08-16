export type Logger = {
  info: (s: string) => Promise<void>;
  error: (s: string) => Promise<void>;
};
