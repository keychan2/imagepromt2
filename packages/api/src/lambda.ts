import { authRouter } from "./router/auth";
import { customerRouter } from "./router/customer";
import { createTRPCRouter } from "./trpc";

export const lambdaRouter = createTRPCRouter({
  auth: authRouter,
  customer: customerRouter,
});