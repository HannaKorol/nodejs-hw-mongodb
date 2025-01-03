import { model, Schema } from 'mongoose';

const Session = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true }, 
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true }, //короткоживучий(в нашому випадку 15 хвилин) токен, який браузер буде нам додавати в хедери запитів (хедер Authorization)
    refreshTokenValidUntil: { type: Date, required: true }, //більш довгоживучому (в нашому випадку 1 день, але може бути і більше) токену, який можна буде обміняти на окремому ендпоінті на нову пару access + resfresh токенів. Зберігається в cookies(поговоримо про них детальніше трохи далі)
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('sessions', Session);
