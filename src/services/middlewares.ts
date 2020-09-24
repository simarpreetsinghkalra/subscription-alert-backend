import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/models';


const createResponseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    res.createResponse = (status: number, success: boolean, message: String, data: any) => {
        const response: ApiResponse<any> = {
            success,
            message,
            data,
        }
        return res.status(status).json(response);
    };
    next();
};

export const middlewares = [
    createResponseMiddleware,
];
