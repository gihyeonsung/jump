export type Config = {
  cron: {
    expression: string;
    timezone: string;
  };
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
