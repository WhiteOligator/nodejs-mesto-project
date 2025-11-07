class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message: string = 'Некорректные данные') {
    return new CustomError(message, 400);
  }

  static Unauthorized(message: string = 'Необходима авторизация') {
    return new CustomError(message, 401);
  }

  static Forbidden(message: string = 'Доступ запрещен') {
    return new CustomError(message, 403);
  }

  static NotFound(message: string = 'Ресурс не найден') {
    return new CustomError(message, 404);
  }

  static Conflict(message: string = 'Конфликт данных') {
    return new CustomError(message, 409);
  }

  static InternalServer(message: string = 'Внутренняя ошибка сервера') {
    return new CustomError(message, 500);
  }
}

export default CustomError;
