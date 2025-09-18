import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "@saasfly/api";
import { lambdaRouter } from "@saasfly/api/lambda";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
    auth: getAuth(req as any),
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/lambda",
    router: lambdaRouter,
    req: req,
    createContext: () => createContext(req),
    onError: ({ error, path }) => {
      console.log("Error in tRPC handler (lambda) on path", path);
      console.error(error);
    },
  });

export { handler as GET, handler as POST };