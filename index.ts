import { schedule } from "node-cron";

import {
  b2CliObjectStorageClient,
  consoleLogger,
  envConfigProvider,
  localClock,
} from "./adapter";
import { Clock, ConfigProvider, Logger, ObjectStorageClient } from "./port";
import { rotate, upload } from "./usecase";

const main: () => Promise<void> = async () => {
  const logger: Logger = consoleLogger;
  const clock: Clock = localClock;

  const configProvider: ConfigProvider = envConfigProvider;
  const config = await configProvider.read();

  const objectStorageClient: ObjectStorageClient = b2CliObjectStorageClient({
    applicationKeyId: config.b2.applicationKeyId,
    applicationKey: config.b2.applicationKey,
    bucketName: config.b2.bucketName,
    logger,
  });

  schedule(
    config.cron.expression,
    async () => {
      try {
        await upload({ clock, configProvider, logger, objectStorageClient });
        await rotate({ clock, configProvider, logger, objectStorageClient });
      } catch (e) {
        await logger.error(`caught unexpected e=${JSON.stringify(e)}`);
        if (e instanceof Error) {
          await logger.error(e.message);
          await logger.error(e.name);
          await logger.error(e.stack ?? "");
        }
      }
    },
    { timezone: config.cron.timezone }
  );
};

main();
