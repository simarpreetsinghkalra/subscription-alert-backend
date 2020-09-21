import { } from './../services/authService';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { IUser } from "../models";
import { utils, userService, authService } from "../services";

const loginUser = async (req: Request, res: Response) => {
    const user: IUser = req.body.data;
    if (user.email && user.password) {
        try {
            const foundUser = await userService.getUserByEmail(user.email, true);
            if (foundUser && foundUser.password) {
                const isPassValid = await bcrypt.compare(user.password, foundUser.password.toString());
                if (isPassValid) {
                    const tokens = await authService.generateJWT(foundUser._id);
                    const response = utils.createResponse(true, 'Authenticated', tokens);
                    res.status(200).json(response);
                } else {
                    const response = utils.createResponse(false, 'Authentication Failed: Email or password is wrong', null);
                    res.status(401).json(response);
                }
            } else {
                const response = utils.createResponse(false, 'User with this email does not exist. Please Sign Up before continuing.', null);
                res.status(404).json(response);
            }
        } catch (error) {
            const response = utils.createResponse(false, 'Internal Server Error', error);
            res.status(500).json(response);
        }
    } else {
        const response = utils.createResponse(false, 'Enter valid email and password', null);
        res.status(404).json(response);
    }
}

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.data
    if (refreshToken) {
        try {
            const tokens = await authService.refreshTokens(refreshToken);
            const response = utils.createResponse(true, 'Allocated new tokens', tokens);
            res.status(200).json(response);
        } catch (error) {
            const response = utils.createResponse(false, 'Operation Failed', error);
            res.status(500).json(response);
        }
    } else {
        const response = utils.createResponse(false, 'Unautorized access detected.', null);
        res.status(401).json(response);
    }
}

const logoutUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await userService.updateUserRefreshToken(req.body.user.userId, '');
        if (updatedUser) {
            const response = utils.createResponse(true, 'Logged out.', null);
            res.status(200).json(response);
        } else {
            throw 'Problem logging out';
        }
    } catch (error) {
        const response = utils.createResponse(true, 'Internal server error', null);
        res.status(500).json(response);
    }
}

export const authCtrl = {
    loginUser,
    refreshToken,
    logoutUser,
}