import { authRouter } from "./router/auth";
import { customerRouter } from "./router/customer";
import { k8sRouter } from "./router/k8s";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc";

export const lambdaRouter = createTRPCRouter({
  auth: authRouter,
  customer: customerRouter,
  k8s: k8sRouter,
  stripe: stripeRouter,
});