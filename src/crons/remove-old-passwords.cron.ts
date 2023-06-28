import { CronJob } from 'cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Action } from '../models';

dayjs.extend(utc);

const passRemover = async () => {
  const prevYear = dayjs().utc().subtract(1, 'year').toISOString();
  await Action.deleteMany({
    createdAt: { $lte: prevYear },
  });
};

export const removeOldPass = new CronJob('0 0 0 * * *', passRemover);
