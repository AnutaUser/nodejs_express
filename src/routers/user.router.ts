import { Router } from 'express';

import { userController } from '../controllers';
import { commonMiddleware } from '../middlewares';
import { UserValidator } from '../validators';

const router = Router();

router.get('/', userController.findAll);
router.post(
  '/',
  commonMiddleware.isBodyValid(UserValidator.create),
  userController.create
);

router.get(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  userController.getByUserId
);
router.put(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.update
);
router.delete(
  '/:userId',
  commonMiddleware.isIdValid('userId'),
  userController.deleteByUserId
);

export const userRouter = router;
