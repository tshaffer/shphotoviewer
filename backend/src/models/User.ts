import * as mongoose from 'mongoose';
import { connection } from '../config';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    googleId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true }, // Add this field
    refreshToken: { type: String, required: true },
  }
);

export const getUserModel = () => {
  const userModel = connection.model('user', UserSchema);
  return userModel;
}

export default UserSchema;
