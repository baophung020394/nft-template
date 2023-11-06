import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  avatar: string;
  level: number;
  levelName: string;
  createdDate: Date;
  modifiedDate: Date;
}


export const User = mongoose.model<IUser>('User', new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  avatar: String,
  level: {
    type: Number,
    required: true
  },
  levelName: {
    type: String,
    required: true
  },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
}));
