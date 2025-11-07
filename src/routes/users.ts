import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
} from '../controllers/users';
import { validateUpdateAvatar, validateUpdateProfile, validateUserId } from '../middlewares/validations';

const router = Router();

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUpdateProfile, updateUserProfile);

router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

export default router;
