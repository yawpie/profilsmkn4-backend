// TODO this is under progress,
// the purpose is to not have to rewrite code
// so i make this to have some consistent response body.
class AuthResponse {
    private message: string;
    private success: boolean;
    private data: object | null;
    constructor(message: string, success: boolean, data: object | null = null) {
        this.message = message;
        this.success = success;
        this.data = data;
    }
    public getMessage(): string {
        return this.message;
    }
    public getSuccess(): boolean {
        return this.success;
    }
    public getToken(): object | null {
        return this.data;
    }
    public generateResponse(): object {
        return {
            message: this.message,
            success: this.success,
            data: this.data ? this.data : null
        };
    };
}
export default AuthResponse;