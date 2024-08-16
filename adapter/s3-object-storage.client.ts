import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { exec, ExecException } from "child_process";
import { ObjectStorageClient } from "../port";

export const s3ObjectStorageClient = (config: {
  endpoint: string;
  region: string;
  credentials: { accessKeyId: string; secretAccessKey: string };
  bucketName: string;
}): ObjectStorageClient => ({
  list: async (): Promise<string[]> => {
    const s3 = new S3Client(config);
    const result = await s3.send(
      new ListObjectsCommand({
        Bucket: config.bucketName,
      })
    );
    s3.destroy();
    return (result.Contents ?? []).map((c) => c.Key!);
  },

  copy: async (pathLocal: string, pathRemote: string): Promise<void> => {
    const command = [
      `aws s3 cp`,
      pathLocal,
      `s3://${config.bucketName}/${pathRemote}`,
      `--recursive`,
      `--endpoint-url=${config.endpoint}`,
    ].join(" ");
    await new Promise<void>((resolve, reject) =>
      exec(
        command,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error !== null) {
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
      `aws s3 rm`,
      `s3://${config.bucketName}/${pathRemote}`,
      `--recursive`,
      `--endpoint-url=${config.endpoint}`,
    ].join(" ");
    await new Promise<void>((resolve, reject) =>
      exec(
        command,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error !== null) {
            reject(error);
          } else {
            resolve();
          }
        }
      )
    );
  },
});
