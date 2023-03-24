import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  GITHUB_TOKEN: z.string(),
  GITHUB_ORG: z.string(),
  HOME: z.string(),
  GITHUB_USERNAME: z.string(),
});

export const env = envSchema.parse(process.env);
