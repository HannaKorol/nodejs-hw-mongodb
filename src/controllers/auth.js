import { loginUser, logoutUser, registerUser } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';
import { refreshUsersSession } from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';


export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// функція loginUserController виконує процес обробки запиту на вхід користувача і взаємодію з клієнтом через HTTP. loginUser виконує процес аутентифікації і повертає об'єкт сесії.
export const loginUserController = async (req, res) => {
 /*  await loginUser(req.body); */ //тіло запиту (req.body), яке містить дані для входу (email та пароль).

  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  //Відповідь сервера, в разі успішного створення нового контакт
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//функція logoutUserController  обробляє HTTP-запит на вихід користувача, викликає функцію для видалення сесії logoutUser, очищає відповідні куки та відправляє клієнту відповідь про успішний вихід з системи.
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId); //Перевірка наявності sessionId:перевіряє, чи існує кукі sessionId у запиті. Якщо sessionId присутній, функція викликає logoutUser, передаючи їй значення sessionId. Це дозволяє видалити сесію користувача з бази даних або здійснити інші необхідні дії для виходу користувача.
  }

  //Очищення куків: Функція очищає кукі sessionId і refreshToken, використовуючи метод res.clearCookie. Це видаляє відповідні куки з браузера клієнта, що забезпечує вихід користувача з системи на стороні клієнта.
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send(); //Відправлення відповіді: Функція відправляє відповідь клієнту зі статусним кодом 204 (No Content). Це означає, що запит був успішно оброблений, але у відповіді немає тіла повідомлення.
};

const setupSession = (res, session, expiry = THIRTY_DAYS) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + expiry),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + expiry),
  });
};

//функція refreshUserSessionController обробляє HTTP-запит на оновлення сесії користувача, викликає функцію для оновлення сесії refreshUsersSession, встановлює нові куки для збереження токенів та ідентифікатора сесії, і відправляє клієнту відповідь з інформацією про успішне оновлення сесії та новим токеном доступу.
export const refreshUserSessionController = async (req, res) => {
  //Виклик функції оновлення сесії: функцію refreshUsersSession, передаючи їй об'єкт з sessionId та refreshToken, отримані з куків запиту (req.cookies.sessionId та req.cookies.refreshToken).
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId, // sessionId також зберігається як http-only cookie
    refreshToken: req.cookies.refreshToken, //refreshToken зберігається як http-only cookie, що означає, що він доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії один день.
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!', //повідомлення про успішне оновлення сесії та дані, що містять accessToken
    data: {
      accessToken: session.accessToken,
    },
  });
};


export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  /* const { password, token } = req.body; */
  res.json({
    message: 'Password has been successfully reset!',
    status: 200,
    data: {},
  });

/*   console.log(req.body); */
};

