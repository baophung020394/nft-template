import mongoose, { Document, Schema } from 'mongoose';


interface ICard extends Document {
  name: string;
  image: string;
  priceETH: number;
  user: { type: Schema.Types.ObjectId, ref: 'User' };
  category: string;
  tier: string;
  theme: string;
  colorFrom: string;
  colorTo: string;
  createdDate: Date;
  modifiedDate: Date;
}


export const Card = mongoose.model<ICard>('Card', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: String,
  priceETH: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  colorFrom: String,
  colorTo: String,
  tier: String,
  theme: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
}));
