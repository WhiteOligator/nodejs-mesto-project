import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import CustomError from '../errors/CustomError';
import { SUCESS_CODE } from '../const/error-code';
import JWT_SECRET from '../const/key';

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw CustomError.Unauthorized('Неправильные почта или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw CustomError.Unauthorized('Неправильные почта или пароль');
    }

    const payload = {
      _id: user._id.toString(),
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(SUCESS_CODE[200]).json({
      message: 'Успешная авторизация',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};
