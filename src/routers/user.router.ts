import { Router } from 'express';

import { userController } from '../controllers';
import {
  authMiddleware,
  commonMiddleware,
  fileMiddleware,
} from '../middlewares';
import { UserValidator } from '../validators';

const router = Router();

router.get('/', userController.findAll);

router.get(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.getByUserId
);

router.put(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.update
);

router.delete(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.deleteByUserId
);

router.post(
  '/:userId/photo',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  fileMiddleware.isPhotoValid,
  userController.addPhoto
);

router.delete(
  '/:userId/photo',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.deletePhoto
);

router.post(
  '/:userId/video',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.addVideo
);

export const userRouter = router;
