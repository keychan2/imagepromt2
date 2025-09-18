import { helloRouter } from "./router/health_check";
import { createTRPCRouter } from "./trpc";

export const edgeRouter = createTRPCRouter({
  hello: helloRouter,
});
