import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';

import { IUser, HttpError } from '../models';
import { authService, sendEmail, userService } from '../services';
import { emailContent } from '../services/emailContent';
import IControllerBase from '../interfaces/IControllerBase.interface';


class UserController implements IControllerBase {
    public path = '/api/user';
    public router = Router();

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.post('/', this.createUser);
        this.router.get('/profile', authService.authenticateToken, this.getUser);
        this.router.put('/forgetPassword', this.forgetPassword);
        this.router.put('/updatePassword', authService.authenticateToken, this.updatePassword);
    }

    createUser = async (req: Request, res: Response) => {
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
                res.sendError(error);
            }
        } else {
            res.createResponse(500, false, 'Password does not match with Confirm Password', null);
        }
    };



    getUser = async (req: Request, res: Response) => {
        try {
            const foundUser = await userService.getUserById(req.body.user.userId);
            if (foundUser) {
                res.createResponse(200, true, 'success', foundUser);

            } else {
                res.createResponse(404, false, 'User with given ID not found', null);
            }
        } catch (error) {
            res.sendError(error);
        }
    }

    forgetPassword = async (req: Request, res: Response) => {
        try {
            const user: IUser = req.body.data; // email exist here from body data
            if (user.email) {
                const randomPassword = crypto.randomBytes(5).toString('hex');
                const updatedUser = await userService.updateRandomPassword(user.email, randomPassword);
                if (updatedUser) {
                    const emailText = emailContent.randomPassEmail(randomPassword);
                    await sendEmail(user.email, 'Forget Password', emailText);
                    res.createResponse(200, true, 'New password sent to your email.', null);
                } else {
                    throw new HttpError('User with matching details not found', 404);
                }
            } else {
                throw new HttpError('Please provide valid email', 400);
            }
        } catch (error) {
            res.sendError(error);
        }
    }

    updatePassword = async (req: Request, res: Response) => {
        try {
            const user = req.body.data; // password, newPassword, comfirmPassword exist here from req.body.data
            user.id = req.body.user.userId; // add userId from auth token
            const foundUser = await userService.getUserById(user.id, true);
            if (foundUser && foundUser.password) {
                const isPassValid = await bcrypt.compare(user.password, foundUser.password.toString());
                if (isPassValid) {
                    if (user.newPassword === user.confirmPassword) {
                        await userService.updateUserPassword(foundUser._id, user.newPassword);
                        res.createResponse(200, true, 'Your new password is updated', null);
                    } else {
                        throw new HttpError('Passowrd annd confirm passowrd do not match', 400);
                    }
                }
            } else {
                throw new HttpError('User not found', 404);
            }
        } catch (error) {
            res.sendError(error);
        }
    }
}

export default UserController;