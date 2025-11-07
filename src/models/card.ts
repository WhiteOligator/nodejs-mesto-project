import mongoose, { Document, Types } from 'mongoose';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const imageUrlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Поле "name" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    validate: {
      validator: (name: string) => /^[a-zA-Zа-яА-ЯёЁ0-9\s-]+$/.test(name),
      message: 'Поле "name" может содержать только буквы, цифры, пробелы и дефисы',
    },
  },
  link: {
    type: String,
    required: [true, 'Поле "link" обязательно для заполнения'],
    validate: {
      validator: (url: string) => imageUrlRegex.test(url),
      message: 'Некорректный формат URL для изображения',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "owner" обязательно для заполнения'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

export default mongoose.model<ICard>('card', cardSchema);
