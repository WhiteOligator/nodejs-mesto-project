import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import CustomError from '../errors/CustomError';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find()
      .populate('owner', 'name about avatar')
      .populate('likes', 'name about avatar');
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user!._id;

    const newCard = new Card({
      name,
      link,
      owner,
    });

    const savedCard = await newCard.save();

    const populatedCard = await Card.findById(savedCard._id)
      .populate('owner', 'name about avatar');

    res.status(201).json(populatedCard);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await Card.findById(cardId);

    if (!card) {
      throw CustomError.NotFound('Карточка с указанным _id не найдена');
    }

    if (card.owner.toString() !== userId.toString()) {
      throw CustomError.Forbidden('Недостаточно прав для удаления карточки');
    }

    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
      .populate('owner', 'name about avatar')
      .populate('likes', 'name about avatar');

    if (!card) {
      throw CustomError.NotFound('Передан несуществующий _id карточки');
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
      .populate('owner', 'name about avatar')
      .populate('likes', 'name about avatar');

    if (!card) {
      throw CustomError.NotFound('Передан несуществующий _id карточки');
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};
