import { } from './../services/authService';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { IUser } from "../models";
import { userService, authService } from "../services";

const loginUser = async (req: Request, res: Response) => {
    const user: IUser = req.body.data;
    if (user.email && user.password) {
        try {
            const foundUser = await userService.getUserByEmail(user.email, true);
            if (foundUser && foundUser.password) {
                const isPassValid = await bcrypt.compare(user.password, foundUser.password.toString());
                if (isPassValid) {
                    const tokens = await authService.generateJWT(foundUser._id);
                    res.createResponse(200, true, 'Authenticated', tokens);;
                } else {
                    res.createResponse(401, false, 'Authentication Failed: Email or password is wrong', null);
                }
            } else {
                res.createResponse(404, false, 'User with this email does not exist. Please Sign Up before continuing.', null);
            }
        } catch (error) {
            res.createResponse(500 ,false, 'Internal Server Error', error);
        }
    } else {
        res.createResponse(401, false, 'Enter valid email and password', null);
    }
}

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.data
    if (refreshToken) {
        try {
            const tokens = await authService.refreshTokens(refreshToken);
            res.createResponse(200, true, 'Allocated new tokens', tokens);
        } catch (error) {
            res.createResponse(500, false, 'Operation Failed', error);
        }
    } else {
        const response = res.createResponse(401, false, 'Unautorized access detected.', null);
    }
}

const logoutUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await userService.updateUserRefreshToken(req.body.user.userId, '');
        if (updatedUser) {
            res.createResponse(200, true, 'Logged out.', null);
        } else {
            throw new HttpError('Problem Logging Out', 500);
        }
    } catch (error) {
        res.createResponse(500, true, 'Internal server error', error);
    }
}

export const authCtrl = {
    loginUser,
    refreshToken,
    logoutUser,
}