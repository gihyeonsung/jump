import { Config, ConfigProvider } from "../port";

export const envConfigProvider: ConfigProvider = {
  read: async (): Promise<Config> => {
    require("dotenv").config();

    return {
      cronExpression: process.env["JUMP_CRON_EXPRESSION"]!,
      path: process.env["JUMP_PATH"]!,
      rotateRetentionDays: Number(process.env["JUMP_ROTATE_RETENTION_DAYS"]!),
      aws: {
        endpoint: process.env["JUMP_AWS_ENDPOINT"]!,
        region: process.env["JUMP_AWS_REGION"]!,
        credentials: {
          accessKeyId: process.env["JUMP_AWS_ACCESS_KEY_ID"]!,
          secretAccessKey: process.env["JUMP_AWS_SECRET_ACCESS_KEY"]!,
        },
        bucketName: process.env["JUMP_AWS_BUCKET_NAME"]!,
      },
    };
  },
};
