import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';



//функція authenticate обробляє запит на аутентифікацію, перевіряє наявність і дійсність заголовка авторизації та токена доступу, шукає відповідну сесію та користувача, а також додає об'єкт користувача до запиту, якщо всі перевірки успішні.
export const authenticate = async (req, res, next) => {
  //Перевірка заголовка авторизації:
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header')); //Якщо заголовок авторизації не надано, функція викликає помилку з кодом 401 (Будь ласка, надайте заголовок авторизації) і передає її до наступної функції за допомогою next.
    return;
  }

  //Перевірка типу заголовка та наявності токена:
  const bearer = authHeader.split(' ')[0]; //має бути 2 частинки 
  const token = authHeader.split(' ')[1];

  //Якщо тип заголовка не "Bearer" або токен відсутній, функція викликає помилку з кодом 401 (Заголовок авторизації повинен бути типу Bearer) і передає її до наступної функції.
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  //    Функція шукає сесію в колекції SessionsCollection за наданим токеном доступу.
  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found')); // Якщо сесію не знайдено, функція викликає помилку з кодом 401 (Сесію не знайдено) і передає її до наступної функції.
    return;
  }

  //Перевірка терміну дії токена доступу:
  //Функція перевіряє, чи не минув термін дії токена доступу, порівнюючи поточну дату з датою закінчення дії токена.
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  //Якщо токен прострочений, функція викликає помилку з кодом 401 (Токен доступу прострочений) і передає її до наступної функції.
  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }




  //Пошук користувача: Функція шукає користувача в колекції UsersCollection за ідентифікатором користувача, який зберігається в сесії.
  const user = await UsersCollection.findById(session.userId);

  //Якщо користувача не знайдено, функція викликає помилку з кодом 401 і передає її до наступної функції.
  if (!user) {
    next(createHttpError(401, 'User is not found'));
    return;
  }

  //Якщо всі перевірки успішні, функція додає об'єкт користувача до запиту (req.user = user).
  /*   req.user = user; */ //!- З конспекту
  req.user = { _id: user._id, name: user.name }; //! - З лекції

  //Викликається наступна функція за допомогою next, що дозволяє продовжити обробку запиту.
  next();
};
