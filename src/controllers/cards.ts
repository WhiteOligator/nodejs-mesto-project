import { Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_CODES, SUCESS_CODE } from '../const/error-code';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find()
      .populate('owner', 'name about avatar')
      .populate('likes', 'name about avatar');
    return res.status(SUCESS_CODE[200]).json(cards);
  } catch (error) {
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при получении карточек', error });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    if (!owner) {
      return res.status(ERROR_CODES[401]).json({ message: 'Пользователь не авторизован' });
    }

    if (!name || !link) {
      return res.status(ERROR_CODES[400]).json({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }

    const newCard = new Card({
      name,
      link,
      owner,
    });

    const savedCard = await newCard.save();

    const populatedCard = await Card.findById(savedCard._id)
      .populate('owner', 'name about avatar');

    return res.status(SUCESS_CODE[201]).json(populatedCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any;
      const errors = Object.values(validationError.errors).map((err: any) => err.message);
      return res.status(ERROR_CODES[400]).json({
        message: 'Ошибка валидации',
        errors,
      });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при создании карточки', error });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(ERROR_CODES[401]).json({ message: 'Пользователь не авторизован' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(ERROR_CODES[404]).json({ message: 'Карточка с указанным _id не найдена' });
    }

    if (card.owner.toString() !== userId.toString()) {
      return res.status(ERROR_CODES[403]).json({ message: 'Недостаточно прав для удаления карточки' });
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(SUCESS_CODE[200]).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(ERROR_CODES[400]).json({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при удалении карточки', error });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(ERROR_CODES[401]).json({ message: 'Пользователь не авторизован' });
    }

    if (!cardId) {
      return res.status(ERROR_CODES[400]).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
      .populate('owner', 'name about avatar')
      .populate('likes', 'name about avatar');

    if (!card) {
      return res.status(ERROR_CODES[404]).json({ message: 'Передан несуществующий _id карточки' });
    }

    return res.status(SUCESS_CODE[200]).json(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(ERROR_CODES[400]).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при добавлении лайка', error });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(ERROR_CODES[401]).json({ message: 'Пользователь не авторизован' });
    }

    if (!cardId) {
      return res.status(ERROR_CODES[400]).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
      .populate('owner', 'name about avatar')
      .populate('likes', 'name about avatar');

    if (!card) {
      return res.status(ERROR_CODES[404]).json({ message: 'Передан несуществующий _id карточки' });
    }

    return res.status(SUCESS_CODE[200]).json(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(ERROR_CODES[400]).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }
    return res.status(ERROR_CODES[500]).json({ message: 'Ошибка при удалении лайка', error });
  }
};
