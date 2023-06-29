import cors from 'cors';

export const corsUtil = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Authorization',
    'Content-Type',
    'Origin',
    'Access-Control-Allow_Origin',
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
