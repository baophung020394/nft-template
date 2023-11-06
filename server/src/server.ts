import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
const cors = require('cors');
import { cardRouter } from './routes/card';
import { userRouter } from './routes/user';

const app = express();
app.use(cors());
const PORT = 3002;

mongoose.connect('mongodb+srv://baofuture94:Thuthuy1994@nft.pkncbjt.mongodb.net/?retryWrites=true&w=majority');

app.use(express.json());
app.use('/card', cardRouter);
app.use('/users', userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
