import { Request, Response } from 'express';
import User from '../models/user';
import { ERROR_CODES, SUCESS_CODE } from '../const/error-code';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(SUCESS_CODE[200]).json(users);
  } catch (error) {
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при получении пользователей', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(ERROR_CODES[404]).json({ message: 'Пользователь не найден' });
    }

    return res.status(SUCESS_CODE[200]).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(ERROR_CODES[404]).json({ message: 'Пользователь не найден' });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при получении пользователя', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    if (!name || !about || !avatar) {
      return res.status(ERROR_CODES[400]).json({
        message: 'Все поля (name, about, avatar) обязательны для заполнения',
      });
    }

    const newUser = new User({
      name,
      about,
      avatar,
    });

    const savedUser = await newUser.save();
    return res.status(SUCESS_CODE[201]).json(savedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any;
      const errors = Object.values(validationError.errors).map((err: any) => err.message);
      return res.status(ERROR_CODES[400]).json({
        message: 'Ошибка валидации',
        errors,
      });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при создании пользователя', error });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    if (!userId) {
      return res.status(ERROR_CODES[401]).json({ message: 'Пользователь не авторизован' });
    }

    if (!name && !about) {
      return res.status(ERROR_CODES[400]).json({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(ERROR_CODES[404]).json({ message: 'Пользователь с указанным _id не найден' });
    }

    return res.status(SUCESS_CODE[200]).json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any;
      const errors = Object.values(validationError.errors).map((err: any) => err.message);
      return res.status(ERROR_CODES[400]).json({
        message: 'Ошибка валидации',
        errors,
      });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при обновлении профиля', error });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    if (!userId) {
      return res.status(ERROR_CODES[401]).json({ message: 'Пользователь не авторизован' });
    }

    if (!avatar) {
      return res.status(ERROR_CODES[400]).json({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(ERROR_CODES[404]).json({ message: 'Пользователь с указанным _id не найден' });
    }

    return res.status(SUCESS_CODE[200]).json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any;
      const errors = Object.values(validationError.errors).map((err: any) => err.message);
      return res.status(ERROR_CODES[400]).json({
        message: 'Ошибка валидации',
        errors,
      });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при обновлении аватара', error });
  }
};
