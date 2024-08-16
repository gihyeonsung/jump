export type ObjectStorageClient = {
  list: () => Promise<string[]>;
  copy: (pathLocal: string, pathRemote: string) => Promise<void>;
  delete: (pathRemote: string) => Promise<void>;
};
