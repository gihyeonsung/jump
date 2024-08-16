export type Config = {
  path: string;
  rotateRetentionDays: number;
  aws: {
    endpoint: string;
    region: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    bucketName: string;
  };
};

export type ConfigProvider = {
  read: () => Promise<Config>;
};
