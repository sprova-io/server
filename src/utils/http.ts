import { Application, Errback, NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ApiError } from './errors';

export const unauthorized = () => (err: Errback, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ ok: false, message: 'Authentication failed' });
    } else {
        next();
    }
};

export function parseObjectId(_id: any): ObjectId {
    if (!ObjectId.isValid(_id)) {
        throw new ApiError(400, `ObjectId(${_id}) is not valid`);
    }

    return new ObjectId(_id);
}
