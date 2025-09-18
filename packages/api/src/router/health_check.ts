import { z } from "zod";

import { createTRPCRouter, procedure } from "../trpc";

export const helloRouter = createTRPCRouter({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts: { input: { text: string } }) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
