class HttpError implements Error {
    responseCode: number;
    name: string = 'HttpError';
    message: string;
    constructor(message: string, responseCode: number) {
        this.responseCode = responseCode;
        this.message = message
    }
}
export default HttpError;