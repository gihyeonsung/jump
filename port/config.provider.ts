export type Config = {
  cron: {
    expression: string;
    timezone: string;
  };
  path: string;
  rotateRetentionDays: number;
  b2: {
    applicationKeyId: string;
    applicationKey: string;
    bucketName: string;
  };
};

export type ConfigProvider = {
  read: () => Promise<Config>;
};
