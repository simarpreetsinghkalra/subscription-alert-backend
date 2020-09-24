class HttpError extends Error {
    private responseCode: Number;
    constructor(message: string, responseCode: Number) {
        super(message);
        this.responseCode = responseCode;
    }
}