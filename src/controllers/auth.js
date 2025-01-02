import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

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
  await loginUser(req.body); //тіло запиту (req.body), яке містить дані для входу (email та пароль).

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
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