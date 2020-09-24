import { userService } from './userService';
import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';

const generateJWT = async (userId: string) => {
    if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
        const accessToken = jsonwebtoken.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
        const refreshToken = jsonwebtoken.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET);
        const updatedUser = userService.updateUserRefreshToken(userId, refreshToken);
        if (updatedUser) {
            return { accessToken, refreshToken }
        } else {
            throw new HttpError('Authentication failed due to backend error', 500);
        }
    } else {
        throw new HttpError('Provide Access Token Secret', 500);
    }
};

const refreshTokens = async (refreshToken: string) => {
    const foundUser = await userService.getUserByRefreshToken(refreshToken);
    if (foundUser) {
        if (process.env.REFRESH_TOKEN_SECRET) {
            return jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, tokenData: any) => {
                if (err) {
                    throw new HttpError(`${err.message} or Refresh token is expired`, 403);
                } else {
                    if (tokenData && tokenData.userId ) {
                        const newTokens =  await generateJWT(tokenData.userId);
                        return newTokens;
                    } else {
                        throw new HttpError('Error decrypting data', 500);
                    }
                }
            });
        } else {
            throw new HttpError('Provide Access Token Secret', 500);
        }
    } else {
        throw new HttpError('Access token is invalid', 401);
    }
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']?.toString();
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.createResponse(401, false, 'Unauthorized Access Detected', null);
    } else {
        if (process.env.ACCESS_TOKEN_SECRET) {
            jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {
                if (err) {
                    res.createResponse(403, false, 'Authentication Failed: Token Expired', err);
                } else {
                    req.body.user = tokenData;
                    next();
                }
            });
        } else {
            // throw 'Invalid Access Token Secret';
            res.createResponse(500, false, 'Verification Failed', null);
        }
    }
}

export const authService = {
    generateJWT,
    refreshTokens,
    authenticateToken
}