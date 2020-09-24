import { Request, Response } from 'express';
import { userService } from '../services';

const createUser = async (req: Request, res: Response) => {
    const user = req.body.data;
    if (user.password === user.confirmPassword) {
        delete user['confirmPassword'];
        try {
            const newUser = await userService.createUser(user);
            if (newUser) {
                res.createResponse(200, true, `Now you can login using email ${newUser.email}`, null);
            } else {
                res.createResponse(500, false, 'Internal Server Error', null);
            }
        } catch (error) {
            res.createResponse(500, false, 'Internal Server Error', error);
        }
    } else {
        res.createResponse(500, false, 'Password does not match with Confirm Password', null);
    }
};



const getUser = async (req: Request, res: Response) => {
    try {
        const foundUser = await userService.getUserById(req.body.user.userId);
        if (foundUser) {
            res.createResponse(200, true, 'success', foundUser);

        } else {
            res.createResponse(404, false, 'User with given ID not found', null);
        }
    } catch (error) {
        res.createResponse(500, false, 'Internal Server Error', null);
    }
}

export const userCtrl = {
    createUser,
    getUser
}