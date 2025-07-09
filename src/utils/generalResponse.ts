import { Response } from "express";
import HttpError from "../errorHandler/responseError";


export type StatusCode = 200 | 201 | 202 | 400 | 401 | 403 | 404 | 500;
/**
 * @deprecated
 */
class GeneralResponse<T = object> {
    success: boolean = true;
    message: string = "";
    data: T | null = null;
    error?: unknown;
    statusCode: StatusCode = 200;

    public static sendWithData<T>(res: Response, status: StatusCode = 200, data: T) {
        res.status(status).json(data);
        return;
    }

    public static send(res: Response, status: StatusCode = 200, message: string = "success") {
        res.status(status).json({ message });
        return;
    }


    public static defaultResponse(): GeneralResponse {
        return new GeneralResponse().setMessage("success");
    }

    public static responseWithMessage(message: string): GeneralResponse {
        return new GeneralResponse().setMessage(message);
    }

    public static responseWithData<T>(data: T): GeneralResponse<T> {
        return new GeneralResponse<T>().setData(data).setMessage("success").setStatusCode(202);
    }

    public static sendError(err: any): GeneralResponse<any> {
        if (err instanceof HttpError) {
            return new GeneralResponse<any>().setError(err).setSuccess(false).setMessage(err.message).setStatusCode(err.status);
        } else {
            return new GeneralResponse<any>().setError(err.message).setSuccess(false).setMessage(err.message);
        }
    }

    public static responseWithError(error: HttpError): GeneralResponse<HttpError> {
        return new GeneralResponse<HttpError>().setError(error).setSuccess(false).setMessage(error.message).setStatusCode(error.status);
    }

    /**
     * @deprecated use sendError() instead
     */
    public static notFound(error: unknown = "Resource not found"): GeneralResponse<unknown> {
        return new GeneralResponse<unknown>().setSuccess(false).setStatusCode(404).setError(error);
    }
    /**
     * @deprecated use sendError() instead
     */
    public static unauthorized(): GeneralResponse<unknown> {
        return new GeneralResponse<unknown>().setSuccess(false).setStatusCode(401);
    }
    /**
     * @deprecated use sendError() instead
     */
    public static unexpectedError(err: unknown): GeneralResponse<unknown> {
        return new GeneralResponse<unknown>().setSuccess(false).setStatusCode(500).setError(err);
    }
    /**
     * @deprecated use sendError() instead
     */
    public static badRequest(err: unknown): GeneralResponse<unknown> {
        return new GeneralResponse<unknown>().setSuccess(false).setStatusCode(400).setError(err);
    }

    // public static sendError(err: ResponseError): GeneralResponse<ResponseError> {
    //     return new GeneralResponse<ResponseError>().setSuccess(false).setStatusCode(err.status).setError(err);
    // }

    /**
    * @deprecated use sendError() instead
    */
    public static failedResponse(message: string): GeneralResponse {
        return new GeneralResponse().setMessage(message);
    }
    public setMessage(message: string): this {
        this.message = message;
        return this;
    }

    public setData(data: T | null): GeneralResponse<T> {
        this.data = data;
        return this;
    }

    public setSuccess(success: boolean): this {
        this.success = success;
        return this;
    }
    public setError(error: unknown): this {
        this.error = error;
        return this;
    }
    public setStatusCode(statusCode: StatusCode): this {
        this.statusCode = statusCode;
        return this;
    }
}

export default GeneralResponse;
