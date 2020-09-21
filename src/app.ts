import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { authRouter, userRouter } from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URL ? process.env.DB_URL : '');

app.use([authRouter, userRouter]);

app.listen(3000, () => {
    console.log('Server running');
});