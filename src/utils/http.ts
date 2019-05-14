import { Application, Errback, NextFunction, Request, Response } from 'express';

export const unauthorized = () =>  (err: Errback, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ ok: 0, message: 'Authentication failed' });
    } else {
        next();
    }
};
