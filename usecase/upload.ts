import { Clock, ConfigProvider, Logger, ObjectStorageClient } from "../port";

export const upload = async (deps: {
  clock: Clock;
  configProvider: ConfigProvider;
  logger: Logger;
  objectStorageClient: ObjectStorageClient;
}): Promise<void> => {
  const pathLocal = (await deps.configProvider.read()).path;

  const now = await deps.clock.now();
  const pathRemote = `${now}`;

  await deps.objectStorageClient.copy(pathLocal, pathRemote);
  await deps.logger.info(`upload process done pathLocal=${pathLocal}`);
};
