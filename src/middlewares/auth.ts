import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../errors/CustomError';
import JWT_SECRET from '../const/key';

interface JwtPayload {
  _id: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw CustomError.Unauthorized('Необходима авторизация');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const verifyResult = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!verifyResult._id) {
      throw CustomError.Unauthorized('Невалидный токен');
    }

    req.user = { _id: verifyResult._id };
    next();
  } catch (error) {
    next(error);
  }
};
