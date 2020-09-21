import { ApiResponse } from './../models/models';

const createResponse = (success: boolean, message: String, data: any): ApiResponse<any> => {
    const response: ApiResponse<any> = {
        success,
        message,
        data,
    }
    return response;
};

export const utils = {
    createResponse,
}