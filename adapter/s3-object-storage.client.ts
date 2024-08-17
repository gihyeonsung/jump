import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { exec, ExecException } from "child_process";

import { Logger, ObjectStorageClient } from "../port";

export const s3ObjectStorageClient = (deps: {
  aws: {
    bucketName: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
    endpoint: string;
    region: string;
  };
  logger: Logger;
}): ObjectStorageClient => ({
  list: async (): Promise<string[]> => {
    const s3Client = new S3Client({
      region: deps.aws.region,
      credentials: {
        accessKeyId: deps.aws.credentials.accessKeyId,
        secretAccessKey: deps.aws.credentials.secretAccessKey,
      },
    });
    const result = await s3Client.send(
      new ListObjectsCommand({ Bucket: deps.aws.bucketName })
    );
    return (result.Contents ?? []).map((c) => c.Key!);
  },

  copy: async (pathLocal: string, pathRemote: string): Promise<void> => {
    const command = [
      `AWS_ACCESS_KEY_ID=${deps.aws.credentials.accessKeyId}`,
      `AWS_SECRET_ACCESS_KEY=${deps.aws.credentials.secretAccessKey}`,
      `aws s3 cp`,
      pathLocal,
      `s3://${deps.aws.bucketName}/${pathRemote}`,
      `--recursive`,
      `--endpoint-url=${deps.aws.endpoint}`,
    ].join(" ");

    await new Promise<void>((resolve, reject) =>
      exec(
        command,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error !== null) {
            deps.logger.error(
              `stdout=${JSON.stringify(stdout)} stderr=${JSON.stringify(
                stderr
              )}`
            );
            reject(error);
          } else {
            resolve();
          }
        }
      )
    );
  },

  delete: async (pathRemote: string): Promise<void> => {
    const command = [
      `AWS_ACCESS_KEY_ID=${deps.aws.credentials.accessKeyId}`,
      `AWS_SECRET_ACCESS_KEY=${deps.aws.credentials.secretAccessKey}`,
      `aws s3 rm`,
      `s3://${deps.aws.bucketName}/${pathRemote}`,
      `--recursive`,
      `--endpoint-url=${deps.aws.endpoint}`,
    ].join(" ");
    await new Promise<void>((resolve, reject) =>
      exec(
        command,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error !== null) {
            deps.logger.error(
              `stdout=${JSON.stringify(stdout)} stderr=${JSON.stringify(
                stderr
              )}`
            );
            reject(error);
          } else {
            resolve();
          }
        }
      )
    );
  },
});
