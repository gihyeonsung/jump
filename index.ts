import { schedule } from "node-cron";

import {
  consoleLogger,
  envConfigProvider,
  localClock,
  s3ObjectStorageClient,
} from "./adapter";
import { Clock, ConfigProvider, Logger, ObjectStorageClient } from "./port";
import { rotate, upload } from "./usecase";

const main: () => Promise<void> = async () => {
  const logger: Logger = consoleLogger;
  const clock: Clock = localClock;

  const configProvider: ConfigProvider = envConfigProvider;
  const config = await configProvider.read();

  const objectStorageClient: ObjectStorageClient = s3ObjectStorageClient({
    aws: {
      bucketName: config.aws.bucketName,
      credentials: {
        accessKeyId: config.aws.credentials.accessKeyId,
        secretAccessKey: config.aws.credentials.secretAccessKey,
      },
      endpoint: config.aws.endpoint,
      region: config.aws.region,
    },
    logger,
  });

  schedule(
    config.cron.expression,
    async () => {
      try {
        await upload({ clock, configProvider, logger, objectStorageClient });
        await rotate({ clock, configProvider, logger, objectStorageClient });
      } catch (e) {
        logger.error(`caught unexpected e=${JSON.stringify(e)}`);
      }
    },
    { timezone: config.cron.timezone }
  );
};

main();
