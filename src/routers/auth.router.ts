import { Router } from 'express';

import { authController } from '../controllers';
import { EActionTokenType } from '../enums';
import {
  authMiddleware,
  commonMiddleware,
  userMiddleware,
} from '../middlewares';
import { ICredentials, IUser } from '../types';
import { UserValidator } from '../validators';

const router = Router();

router.post(
  '/register',
  commonMiddleware.isBodyValid(UserValidator.create),
  userMiddleware.findAndThrow('email'),
  authController.register
);

router.post(
  '/login',
  commonMiddleware.isBodyValid(UserValidator.login),
  userMiddleware.isUserExist<ICredentials>('email'),
  authController.login
);

router.post(
  '/changePassword',
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword
);

router.post(
  '/forgotPassword',
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  userMiddleware.isUserExist<IUser>('email'),
  authController.forgotPassword
);

router.post(
  '/forgotPassword/:forgotPassToken',
  commonMiddleware.isBodyValid(UserValidator.setForgotPassword),
  authMiddleware.checkActionToken(EActionTokenType.Forgot),
  authController.setForgotPassword
);

router.post(
  '/refresh',
  authMiddleware.checkRefreshToken,
  authController.refresh
);

router.post('/activate', authController.sendActivateToken);

router.post('/activate/:token', authController.activate);

export const authRouter = router;
