import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    /*     createdAt: { type: Date }, //!Перевірити пізніше чи вірно вписала!!!   -> НЕВІРНО бо timestamps створюють ці поля автоматично!!!
    updatedAt: { type: Date }, //!Перевірити пізніше чи вірно вписала!!! ->  НЕВІРНО бо timestamps створюють ці поля автоматично!!!
     */
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
