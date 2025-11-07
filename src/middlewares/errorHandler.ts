import { Request, Response } from 'express';
import CustomError from '../errors/CustomError';
import { ERROR_CODES } from '../const/error-code';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

interface MongoValidationError extends Error {
  errors: Record<string, { message: string }>;
}

interface MongoCastError extends Error {
  kind: string;
  value: string;
  path: string;
}

const errorHandler = (
  err: CustomError | MongoError | MongoValidationError | MongoCastError,
  req: Request,
  res: Response,
) => {
  console.error('Error caught in errorHandler:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    const validationError = err as MongoValidationError;
    const messages = Object.values(validationError.errors).map((error) => error.message);
    return res.status(ERROR_CODES[400]).json({
      message: 'Ошибка валидации данных',
      errors: messages,
    });
  }

  if (err.name === 'CastError') {
    const castError = err as MongoCastError;
    return res.status(ERROR_CODES[400]).json({
      message: `Некорректный ${castError.path}: ${castError.value}`,
    });
  }

  if ((err as MongoError).code === 11000) {
    return res.status(ERROR_CODES[409]).json({
      message: 'Пользователь с таким email уже существует',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(ERROR_CODES[401]).json({
      message: 'Неверный токен авторизации',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(ERROR_CODES[401]).json({
      message: 'Срок действия токена истек',
    });
  }

  if (err.name === 'BcryptError') {
    return res.status(ERROR_CODES[400]).json({
      message: 'Ошибка при обработке пароля',
    });
  }

  const statusCode = (err as CustomError).statusCode || ERROR_CODES[500];
  const message = statusCode === ERROR_CODES[500]
    ? 'На сервере произошла ошибка'
    : err.message;

  return res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.message,
    }),
  });
};

export default errorHandler;
