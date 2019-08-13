export class ApiError extends Error {
    public statusCode: number;
    constructor(statusCode = 400, ...params: any) {
        super(...params);
        this.name = 'ApiError';
        this.statusCode = statusCode;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    public toJson() {
        return { ok: false, errmsg: this.message, type: this.name };
    }
}
