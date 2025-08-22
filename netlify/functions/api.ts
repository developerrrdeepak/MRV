import serverless from "serverless-http";
import { createServer } from "../../server";

let serverInstance: any = null;

export const handler = async (event: any, context: any) => {
  if (!serverInstance) {
    serverInstance = serverless(await createServer());
  }
  return serverInstance(event, context);
};
