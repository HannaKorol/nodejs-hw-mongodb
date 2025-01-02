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


//функція loginUser виконує процес аутентифікації користувача. Вона приймає об'єкт payload, що містить дані для входу, такі як email та пароль.
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  //функція забезпечує аутентифікацію користувача, перевіряє його дані для входу, видаляє попередню сесію, генерує нові токени та створює нову сесію в базі даних.
  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64'); //генеруються нові токени доступу та оновлення. Використовуються випадкові байти, які конвертуються в строку формату base64.
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // функція створює нову сесію в базі даних. Нова сесія включає ідентифікатор користувача, згенеровані токени доступу та оновлення, а також часові межі їхньої дії. Токен доступу має обмежений термін дії (наприклад, 15 хвилин), тоді як токен для оновлення діє довше (наприклад, один день).
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};


//logoutUser-нам треба очистити токена, який записаний в cookies(лише сервер може це зробити, оскільки вони httpOnly), а також видалити сесію із бази даних на основі id сесії:
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

