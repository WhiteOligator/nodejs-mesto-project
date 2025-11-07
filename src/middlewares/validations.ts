import { celebrate, Joi, Segments } from 'celebrate';

const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const cardNameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\s-]+$/;

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).pattern(nameRegex)
      .message('Имя может содержать только буквы, пробелы и дефисы'),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri().pattern(urlRegex)
      .message('Некорректный формат URL для аватара'),
    email: Joi.string().required().email()
      .message('Некорректный формат email'),
    password: Joi.string().required().min(6)
      .message('Пароль должен содержать минимум 6 символов'),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().email()
      .message('Некорректный формат email'),
    password: Joi.string().required().min(6)
      .message('Пароль должен содержать минимум 6 символов'),
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30)
      .pattern(nameRegex)
      .message('Имя может содержать только буквы, пробелы и дефисы'),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().required().uri().pattern(urlRegex)
      .message('Некорректный формат URL для аватара'),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30)
      .pattern(cardNameRegex)
      .message('Название карточки может содержать только буквы, цифры, пробелы и дефисы'),
    link: Joi.string().required().uri().pattern(urlRegex)
      .message('Некорректный формат URL для изображения'),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().required().hex().length(24)
      .message('Некорректный формат ID пользователя'),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().required().hex().length(24)
      .message('Некорректный формат ID карточки'),
  }),
});
