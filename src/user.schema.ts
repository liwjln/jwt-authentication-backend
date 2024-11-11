import { Schema, Document } from 'mongoose';
import { User } from './user.interface';

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  fullName: { type: String },
  username: { type: String },
  phoneNumber: { type: String },
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default UserSchema;
