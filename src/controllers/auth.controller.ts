import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { HttpError, IUser } from "../models";
import { userService, authService } from "../services";
import IControllerBase from '../interfaces/IControllerBase.interface';


class AuthController implements IControllerBase {
    public path = '/api/auth';
    public router = Router();

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.post('/login', this.loginUser);
        this.router.post('/tokens', this.refreshToken);
        this.router.delete('/logout', authService.authenticateToken, this.logoutUser);
    }

    loginUser = async (req: Request, res: Response) => {
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

    refreshToken = async (req: Request, res: Response) => {
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

    logoutUser = async (req: Request, res: Response) => {
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
}

export default AuthController;


