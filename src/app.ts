import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { authRouter, userRouter } from './routes';
import { middlewares } from './services';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares[0]);

mongoose.connect(process.env.DB_URL ? process.env.DB_URL : '');

app.use([authRouter, userRouter]);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});