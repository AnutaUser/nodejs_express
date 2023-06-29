import rateLimit from 'express-rate-limit';

export const ddosLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'You can not make any more requests at the moment. Try again later',
});
