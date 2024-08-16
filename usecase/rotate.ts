import { Clock, ConfigProvider, Logger, ObjectStorageClient } from "../port";

export const rotate = async (deps: {
  clock: Clock;
  configProvider: ConfigProvider;
  logger: Logger;
  objectStorageClient: ObjectStorageClient;
}): Promise<void> => {
  await deps.logger.info(`rotating process done`);

  const rotateRetentionSecs =
    1 * 60 * 60 * 24 * (await deps.configProvider.read()).rotateRetentionDays;
  const tsNow = await deps.clock.now();
  const tsOutdatedAtPoint = tsNow - rotateRetentionSecs;

  const objectNames = await deps.objectStorageClient.list();
  const objectNamesOutdated = objectNames.filter(
    (s) => Number(s) < tsOutdatedAtPoint
  );

  for (const objectNameOutdated of objectNamesOutdated) {
    await deps.objectStorageClient.delete(objectNameOutdated);
    await deps.logger.info(
      `outdated backup directory has been deleted dirnameOutdated=${objectNameOutdated}`
    );
  }

  await deps.logger.info(`rotate process done`);
};
