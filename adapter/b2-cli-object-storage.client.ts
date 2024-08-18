import { exec, ExecException } from "child_process";

import { Logger, ObjectStorageClient } from "../port";

export const b2CliObjectStorageClient = (deps: {
  applicationKeyId: string;
  applicationKey: string;
  bucketName: string;
  logger: Logger;
}): ObjectStorageClient => ({
  list: async (): Promise<string[]> => {
    const command = [
      `B2_APPLICATION_KEY_ID=${deps.applicationKeyId}`,
      `B2_APPLICATION_KEY=${deps.applicationKey}`,
      `b2 ls`,
      `b2://${deps.bucketName}`,
    ].join(" ");
    await deps.logger.info(command);
    const result = await new Promise<string>((resolve, reject) =>
      exec(
        command,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error !== null) {
            reject(error);
          } else {
            resolve(stdout);
          }
        }
      )
    );

    return result
      .split("\n")
      .filter((s) => s !== "")
      .map((s) => s.trim().replace("/", ""));
  },

  copy: async (pathLocal: string, pathRemote: string): Promise<void> => {
    const command = [
      `B2_APPLICATION_KEY_ID=${deps.applicationKeyId}`,
      `B2_APPLICATION_KEY=${deps.applicationKey}`,
      `b2 sync`,
      pathLocal,
      `b2://${deps.bucketName}/${pathRemote}`,
    ].join(" ");
    await deps.logger.info(command);
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
      `B2_APPLICATION_KEY_ID=${deps.applicationKeyId}`,
      `B2_APPLICATION_KEY=${deps.applicationKey}`,
      `b2 rm`,
      `b2://${deps.bucketName}/${pathRemote}`,
      `--versions`,
      `--recursive`,
    ].join(" ");
    await deps.logger.info(command);
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
