import { Config, ConfigProvider } from "../port";

export const envConfigProvider: ConfigProvider = {
  read: async (): Promise<Config> => {
    require("dotenv").config();

    return {
      cron: {
        expression: process.env["JUMP_CRON_EXPRESSION"]!,
        timezone: process.env["JUMP_CRON_TIMEZONE"]!,
      },
      path: process.env["JUMP_PATH"]!,
      rotateRetentionDays: Number(process.env["JUMP_ROTATE_RETENTION_DAYS"]!),
      b2: {
        applicationKeyId: process.env["JUMP_B2_APPLICATION_KEY_ID"]!,
        applicationKey: process.env["JUMP_B2_APPLICATION_KEY"]!,
        bucketName: process.env["JUMP_B2_BUCKET_NAME"]!,
      },
    };
  },
};
