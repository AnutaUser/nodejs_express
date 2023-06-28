import { removeOldTokens } from './remove-old-tokens.cron';

export const cronRunner = async () => {
  removeOldTokens.start();
};
