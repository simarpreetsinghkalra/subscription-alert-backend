import { userService } from './userService';
import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { utils } from '.';

const generateJWT = async (userId: string) => {
    if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
        const accessToken = jsonwebtoken.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
        const refreshToken = jsonwebtoken.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET);
        const updatedUser = userService.updateUserRefreshToken(userId, refreshToken);
        if (updatedUser) {
            return { accessToken, refreshToken }
        } else {
            throw 'Authentication failed due to backend error';
        }
    } else {
        throw 'Provide Access Token Secret';
    }
};

const refreshTokens = async (refreshToken: string) => {
    const foundUser = await userService.getUserByRefreshToken(refreshToken);
    if (foundUser) {
        if (process.env.REFRESH_TOKEN_SECRET) {
            return jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, tokenData: any) => {
                if (err) {
                    throw err;
                } else {
                    if (tokenData && tokenData.userId ) {
                        const newTokens =  await generateJWT(tokenData.userId);
                        return newTokens;
                    } else {
                        throw 'Error decrypting data';
                    }
                }
            });
        } else {
            throw 'Provide Access Token Secret';
        }
    } else {
        throw 'Access token is invalid';
    }
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']?.toString();
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        const response = utils.createResponse(false, 'Unauthorized Access Detected', null);
        res.status(401).json(response);
    } else {
        if (process.env.ACCESS_TOKEN_SECRET) {
            jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {
                if (err) {
                    const response = utils.createResponse(false, 'Internal Server Error', err);
                    res.status(500).json(response);
                } else {
                    req.body.user = tokenData;
                    next();
                }
            });
        } else {
            // throw 'Invalid Access Token Secret';
            const response = utils.createResponse(false, 'Verification Failed', null);
            res.status(500).json(response);
        }
    }
}

export const authService = {
    generateJWT,
    refreshTokens,
    authenticateToken
}