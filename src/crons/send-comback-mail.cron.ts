import { CronJob } from 'cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { EEmailActions } from '../enums';
import { Token, User } from '../models';
import { emailService } from '../services';

dayjs.extend(utc);

const comebackMailSender = async () => {
  const lastWeak = dayjs().utc().subtract(1, 'day').toISOString();

  const oldTokens = await Token.find({ createdAt: { $lte: lastWeak } });

  oldTokens.map(async (token) => {
    const users = await User.find({ _id: token._user });

    users.map(async (user) => {
      await emailService.sendMail(user.email, EEmailActions.COMEBACK, {
        username: user.username,
      });
    });
  });
};

export const sendComebackMail = new CronJob('0 0 9 * * *', comebackMailSender);
