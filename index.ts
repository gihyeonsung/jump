import { envConfigProvider, s3ObjectStorageClient } from "./adapter";

const main: () => Promise<void> = async () => {
  const configProvider = envConfigProvider;
  const config = await configProvider.read();

  const s3ObjectStorageClientConfig = config.aws;
  const objectStorageClient = s3ObjectStorageClient(
    s3ObjectStorageClientConfig
  );
};

main();
