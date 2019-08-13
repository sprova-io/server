import { Response } from 'express';

import { errorWithMessage } from "./formats";

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
        return { ok: false, message: this.message, type: this.name };
    }
}

/**
 * Format error messages and send response with corresponding status code.
 *
 * @param res ExpressJs request object
 * @param e Error object
 */
export const handleError = (res: Response, e: any) => {
    if (e instanceof ApiError) {
        res.status(e.statusCode).json(e.toJson());
    } else {
        res.status(500).json(errorWithMessage(e.message));
    }
};
