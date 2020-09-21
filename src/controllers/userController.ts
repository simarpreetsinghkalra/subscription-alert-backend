import { Request, Response } from 'express';

import { UserModel } from '../models/';
import { userService, utils } from '../services';

const createUser = async (req: Request, res: Response) => {
    const user = req.body.data;
    if (user.password === user.confirmPassword) {
        delete user['confirmPassword'];
        try {
            const newUser = await userService.createUser(user);
            if (newUser) {
                const response = utils.createResponse(true, `Now you can login using email ${newUser.email}`, null);
                res.status(200).json(response);
            } else {
                const response = utils.createResponse(false, 'Internal Server Error', null);
                res.status(500).json(response);
            }
        } catch (error) {
            const response = utils.createResponse(false, 'Internal Server Error', error);
            res.status(500).json(response);
        }
    } else {
        const response = utils.createResponse(false, 'Password does not match with Confirm Password', null);
        res.status(500).json(response);
    }
};



const getUser = async (req: Request, res: Response) => {
    try {
        const foundUser = await userService.getUserById(req.body.user.userId);
        if (foundUser) {
            const response = utils.createResponse(true, 'success', foundUser);
            res.status(200).json(response);
        } else {
            const response = utils.createResponse(false, 'User with given ID not found', null);
            res.status(404).json(response);
        }
    } catch (error) {
        const response = utils.createResponse(false, 'Internal Server Error', null);
        res.status(500).json(response);
    }
}

export const userCtrl = {
    createUser,
    getUser
}