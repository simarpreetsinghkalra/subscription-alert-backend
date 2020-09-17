import { IUser } from './models/models';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import express from 'express';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import { UserModel } from './models/mongoose-models';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URL ? process.env.DB_URL : '');


app.post('/api/user', (req, res) => {
    const user = req.body.data;
    if (user.password === user.confirmPassword) {
        delete user['confirmPassword'];
        bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS)).then(hashedPass => {
            user.password = hashedPass;
            const newUser = new UserModel(user);
            newUser.save((err, registeredUser) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json(registeredUser);
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    } else {
        res.status(500).json();
    }
});

app.post('/api/user/login', (req, res) => {
    const user: IUser = req.body.data;
    if (user.email && user.password) {
        UserModel.findOne({ email: user.email }, (err, foundUser) => {
            if (err) {
                res.status(500).json(err);
            }
            if (foundUser) {
                bcrypt.compare(user.password, foundUser.password.toString()).then(matched => {
                    if (matched) {
                        res.status(200).json('success');
                    } else {
                        res.status(200).json('Authentication Failed');
                    }
                }).catch(err => {
                    res.status(500).json(err);
                });
            } else {
                res.sendStatus(404).json('USER NOT FOUND');
            }
        });
    } else {
        res.status(500).json();
    }
});

app.listen(3000, () => {
    console.log('Server running');
});