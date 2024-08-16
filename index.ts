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
  const configProvider: ConfigProvider = envConfigProvider;
  const config = await configProvider.read();

  const s3ObjectStorageClientConfig = config.aws;
  const objectStorageClient: ObjectStorageClient = s3ObjectStorageClient(
    s3ObjectStorageClientConfig
  );

  const logger: Logger = consoleLogger;
  const clock: Clock = localClock;

  schedule(config.cronExpression, async () => {
    await rotate({ clock, configProvider, logger, objectStorageClient });
    await upload({ clock, configProvider, logger, objectStorageClient });
  });
};

main();
