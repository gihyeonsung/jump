import { Clock, ConfigProvider, Logger, ObjectStorageClient } from "../port";

export const upload = async (
  deps: {
    clock: Clock;
    configProvider: ConfigProvider<any>;
    logger: Logger;
    objectStorageClient: ObjectStorageClient<any>;
  },
  pathLocal: string
): Promise<void> => {
  const now = deps.clock.now();
  const pathRemote = `${now}`;

  await deps.objectStorageClient.upload(deps, pathLocal, pathRemote);
};
