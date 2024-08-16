import {
  Clock,
  ConfigBase,
  ConfigProvider,
  Logger,
  ObjectStorageClient,
} from "../port";

export const rotate = async <Config extends ConfigBase>(deps: {
  clock: Clock;
  configProvider: ConfigProvider<Config>;
  logger: Logger;
  objectStorageClient: ObjectStorageClient<any>;
}): Promise<void> => {
  await deps.logger.info(`rotating process done`);

  const rotateRetentionSecs =
    1 * 60 * 60 * 24 * (await deps.configProvider.read()).rotateRetentionDays;
  const tsNow = await deps.clock.now();
  const tsOutdatedAtPoint = tsNow - rotateRetentionSecs;

  const dirnames = await deps.objectStorageClient.list(deps);
  const dirnamesOutdated = dirnames.filter(
    (s) => Number(s) < tsOutdatedAtPoint
  );

  for (const dirnameOutdated of dirnamesOutdated) {
    await deps.objectStorageClient.delete(deps, dirnameOutdated);
    await deps.logger.info(
      `outdated backup directory has been deleted dirnameOutdated=${dirnameOutdated}`
    );
  }

  await deps.logger.info(`entire rotating process done`);
};
