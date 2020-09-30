// import dotenv from 'dotenv';
// dotenv.config({ path: __dirname + '/.env' });

// // import express from 'express';
// import bodyParser from 'body-parser';

// import { authRouter, userRouter } from './routes';
// import { middlewares } from './services';

// // const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(middlewares[0]);

// mongoose.connect(process.env.DB_URL ? process.env.DB_URL : '');

// app.use([authRouter, userRouter]);

// app.listen(process.env.PORT || 3000, () => {
//     console.log('Server running');
// });

import mongoose from 'mongoose';
import express, { Application } from 'express';

class App {
    public app: Application;
    public port: number;

    constructor(appInit: { port: number; middlewares: any; controllers: any; }) {
        this.app = express();
        this.port = appInit.port;

        this.initDB();
        this.middlewares(appInit.middlewares);
        this.routes(appInit.controllers);
        this.assets();
        this.templates();
    }

    private initDB() {
        mongoose.connect(process.env.DB_URL ? process.env.DB_URL : '');
    }

    private middlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    }

    private assets() {
        this.app.use(express.static('public'));
        this.app.use(express.static('views'));
    }

    private templates() {
        this.app.set('view engine', 'ejs');
    }

    public listen() {
        this.app.listen(process.env.PORT || this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    }
}

export default App;