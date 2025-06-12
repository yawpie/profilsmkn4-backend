type errName = "ResponseError" | "AuthError" | "UnknownError" | "RequestBodyError"
export default class ResponseError extends Error {
    name: string;
    message: string;
    stack?: string | undefined;

    constructor(message: string, name: errName) {
        super();
        this.message = message
        this.name = name
        
        this.stack = new Error().stack;
    }
}