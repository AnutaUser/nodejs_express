import { Router } from 'express';

import { userController } from '../controllers';
import { userMiddleware } from '../middlewares/user.middleware';

const router = Router();

router.get('/', userController.findAll);
router.post('/', userMiddleware.isCreateValid, userController.create);

router.get(
  '/:userId',
  userMiddleware.isUserIdValid,
  userController.getByUserId
);
router.put(
  '/:userId',
  userMiddleware.isUserIdValid,
  userMiddleware.isUpdateValid,
  userController.update
);
router.delete(
  '/:userId',
  userMiddleware.isUserIdValid,
  userController.deleteByUserId
);

export const userRouter = router;
