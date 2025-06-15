class GeneralResponse<T = object> {
    success: boolean = true;
    message: string = "";
    data: T | null = null;
    error?: unknown;

    public static defaultResponse(): GeneralResponse {
        return new GeneralResponse().setMessage("success");
    }

    public static responseWithMessage(message: string): GeneralResponse {
        return new GeneralResponse().setMessage(message);
    }
    public static responseWithData<T>(data: T): GeneralResponse<T> {
        return new GeneralResponse<T>().setData(data).setMessage("success");
    }
    public static responseWithError(error: unknown): GeneralResponse<unknown> {
        return new GeneralResponse<unknown>().setError(error).setSuccess(false).setMessage("Error");
    }


    /**
    * @deprecated Use `responseWithError()` instead.
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
}

export default GeneralResponse;
