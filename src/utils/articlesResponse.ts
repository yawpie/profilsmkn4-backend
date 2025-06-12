import GeneralResponse from "./generalResponse";

class ArticlesResponse extends GeneralResponse {
    public override setSuccess(value: boolean): ArticlesResponse {
        this.success = value;
        return this;
    }

    public override setMessage(message: string): ArticlesResponse {
        this.message = message;
        return this;
    }

    public override setData(data: object | null): ArticlesResponse {
        this.data = data;
        return this;
    }
}

export default ArticlesResponse;