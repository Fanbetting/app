import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ADMINISTRATOR_MNEMONIC: z
      .string()
      .min(1, { message: "ADMINISTRATOR MNEMONIC is required" }),
  },
  runtimeEnv: {
    ADMINISTRATOR_MNEMONIC: process.env.ADMINISTRATOR_MNEMONIC,
  },
});
