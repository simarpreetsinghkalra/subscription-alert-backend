declare namespace Express {
    export interface Response {
        createResponse(status: number, success: boolean, message: String, data: any): any;
        sendError(err: Error): any;
    }
}