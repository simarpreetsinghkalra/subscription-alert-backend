import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import bodyParser from 'body-parser';

import App from './app';
import customResponseMiddleware from './middlewares/customRespose'
import AuthController from './controllers/auth.controller';
import UserController from './controllers/user.controller';

const app = new App({
    port: 3000,
    controllers: [
        new AuthController(),
        new UserController(),
    ],
    middlewares: [
        bodyParser.json(),
        bodyParser.urlencoded({extended: true}),
        customResponseMiddleware
    ],
});

app.listen();