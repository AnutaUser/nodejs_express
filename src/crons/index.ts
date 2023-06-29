import { removeOldPass } from './remove-old-passwords.cron';
import { removeOldTokens } from './remove-old-tokens.cron';
import { sendComebackMail } from './send-comback-mail.cron';

export const cronRunner = async () => {
  removeOldTokens.start();
  removeOldPass.start();
  sendComebackMail.start();
};
