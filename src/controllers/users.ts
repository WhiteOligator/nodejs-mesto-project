import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import User from '../models/user';
import { SUCESS_CODE } from '../const/error-code';
import CustomError from '../errors/CustomError';

declare module 'express' {
  interface Request {
    user?: {
      _id: Types.ObjectId | string;
    };
  }
}

export const getUserMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      throw CustomError.NotFound('Пользователь не найден');
    }

    return res.status(SUCESS_CODE[200]).json(user);
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(SUCESS_CODE[200]).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw CustomError.NotFound('Пользователь не найден');
    }

    return res.status(SUCESS_CODE[200]).json(user);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const validator = await import('validator');
    if (!validator.default.isEmail(email)) {
      throw CustomError.BadRequest('Некорректный формат email');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw CustomError.NotFound('Пользователь не найден');
    }

    return res.status(SUCESS_CODE[200]).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;
    const { avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw CustomError.NotFound('Пользователь с указанным _id не найден');
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};
