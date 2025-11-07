import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const avatarUrlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Поле "name" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    default: 'Жак-Ив Кусто',
    validate: {
      validator: (name: string) => /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(name),
      message: 'Поле "name" может содержать только буквы, пробелы и дефисы',
    },
  },
  about: {
    type: String,
    required: [true, 'Поле "about" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "about" - 2 символа'],
    maxlength: [200, 'Максимальная длина поля "about" - 200 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" обязательно для заполнения'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url: string) => avatarUrlRegex.test(url),
      message: 'Некорректный формат URL для аватара',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле "email" обязательно для заполнения'],
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" обязательно для заполнения'],
    select: false,
    minlength: [6, 'Минимальная длина пароля - 6 символов'],
  },
}, {
  versionKey: false,
});

export default mongoose.model<IUser>('user', userSchema);
