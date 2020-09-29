import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { HttpError, IUser } from "../models";
import { userService, authService } from "../services";

const loginUser = async (req: Request, res: Response) => {
    try {
        const user: IUser = req.body.data;
        if (user.email && user.password) {
            const foundUser = await userService.getUserByEmail(user.email, true);
            if (foundUser && foundUser.password) {
                const isPassValid = await bcrypt.compare(user.password, foundUser.password.toString());
                if (isPassValid) {
                    const tokens = await authService.generateJWT(foundUser._id);
                    res.createResponse(200, true, 'Authenticated', tokens);
                } else {
                    throw new HttpError('Authentication Failed: Email or password is wrong', 401);
                }
            } else {
                throw new HttpError('User with this email does not exist. Please Sign Up before continuing.', 404);
            }
        } else {
            throw new HttpError('Enter valid email and password', 401);
        }
    } catch (error) {
        res.sendError(error);
    }
}

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.data
    if (refreshToken) {
        try {
            const tokens = await authService.refreshTokens(refreshToken);
            res.createResponse(200, true, 'Allocated new tokens', tokens);
        } catch (error) {
            res.sendError(error);
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
        res.sendError(error);
    }
}

export const authCtrl = {
    loginUser,
    refreshToken,
    logoutUser,
}