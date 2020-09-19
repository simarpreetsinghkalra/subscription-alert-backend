import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { IUser, UserModel } from '../models/';

const createUser = async (req: Request, res: Response) => {
    const user = req.body.data;
    if (user.password === user.confirmPassword) {
        delete user['confirmPassword'];
        try {
            const hashedPassword = await bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS));
            user.password = hashedPassword;
            const newUser = new UserModel(user);
            newUser.save((err, registeredUser) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(registeredUser);
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(500).json();
    }
};

const loginUser = async (req: Request, res: Response) => {
    const user: IUser = req.body.data;
    if (user.email && user.password) {
        UserModel.findOne({ email: user.email }, async (err, foundUser) => {
            if (err) {
                res.status(500).json(err);
            }
            if (foundUser) {
                try {
                    const isPassValid = await bcrypt.compare(user.password, foundUser.password.toString());
                    if (isPassValid) {
                        res.status(200).json('success');
                    } else {
                        res.status(200).json('Authentication Failed');
                    }
                } catch (error) {
                    res.status(500).json(error);
                }
            } else {
                res.status(404).json('USER NOT FOUND');
            }
        });
    } else {
        res.status(500).json();
    }
}

export const userCtrl = {
    createUser,
    loginUser,
}