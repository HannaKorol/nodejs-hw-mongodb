import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { UsersCollection } from "../db/models/user.js";
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {
  //Під час створення моделі UsersCollection ми вказали, що email користувача має бути унікальним. Тому нам варто перевіряти email на унікальність під час реєстрації та, у разі дублювання, повертати відповідь зі статусом 409 і відповідним повідомленням. Тому додамо таку перевірку у код нашого сервісу для реєстрації:

  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};



export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
};


