declare namespace Express {
    export interface Response {
        createResponse(status: number, success: boolean, message: string, data: any): any;
        sendError(err: Error): any;
    }
}