import { Router } from 'express';

import { authController } from '../controllers';
import { commonMiddleware } from '../middlewares';
import { UserValidator } from '../validators';

const router = Router();

router.post(
  '/register',
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.register
);
router.post(
  '/login',
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login
);

export const authRouter = router;
