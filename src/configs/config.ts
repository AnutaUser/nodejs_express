import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT || 5005,
};
