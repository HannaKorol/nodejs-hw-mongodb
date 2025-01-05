import cloudinary from 'cloudinary';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'fs/promises';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});



//Цей код налаштовує з'єднання з Cloudinary, використовуючи параметри конфігурації, такі як ім'я хмари, API-ключ та API-секрет, які зчитуються із змінних середовища. Потім створюється асинхронна функція для збереження файлів. Ця функція приймає файл, завантажує його на сервер Cloudinary, видаляє файл із тимчасової папки і повертає безпечну URL-адресу завантаженого файлу.
export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
