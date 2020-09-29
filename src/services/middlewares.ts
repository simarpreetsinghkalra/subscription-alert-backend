import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../models';
import { ApiResponse } from '../models/models';


const createResponseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    res.createResponse = (status: number, success: boolean, message: string, data: any) => {
        const response: ApiResponse<any> = {
            success,
            message,
            data,
        }
        return res.status(status).json(response);
    };

    res.sendError = (error: HttpError) => {
        if  (error instanceof HttpError) {
            res.createResponse(error.responseCode, false, error.message, error);
        } else {
            res.createResponse(500, false, 'Internal Server Error', error);
        }
    }
    
    next();
};

export const middlewares = [
    createResponseMiddleware,
];
