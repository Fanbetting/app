import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    EXECUTOR_MNEMONIC: z
      .string()
      .min(1, { message: "EXECUTOR MNEMONIC is required" }),
  },
  runtimeEnv: {
    EXECUTOR_MNEMONIC: process.env.EXECUTOR_MNEMONIC,
  },
});
