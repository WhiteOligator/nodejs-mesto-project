import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import './models/user';
import './models/card';

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers';

import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { validateCreateUser, validateLogin } from './middlewares/validations';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/mestodb';

app.use(requestLogger);

app.use(express.json());

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running! Connected to MongoDB.',
    endpoints: {
      users: {
        'GET /users': 'Get all users',
        'GET /users/:userId': 'Get user by ID',
        'POST /users': 'Create new user',
        'PATCH /users/me': 'Update user profile',
        'PATCH /users/me/avatar': 'Update user avatar',
      },
      cards: {
        'GET /cards': 'Get all cards',
        'POST /cards': 'Create new card',
        'DELETE /cards/:cardId': 'Delete card by ID',
        'PUT /cards/:cardId/likes': 'Like card',
        'DELETE /cards/:cardId/likes': 'Dislike card',
      },
    },
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed. App terminated');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
