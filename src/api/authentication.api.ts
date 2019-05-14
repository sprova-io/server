import { NextFunction, Request, Response, Router } from 'express';

import authenticationService, { IValidationResponse } from '../services/authentication.service';

import log from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'you-hacker!';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({
            error: 'No username and password. Empty body.'
        });
    } else {
        const credentials = req.body;
        log.info(`Authenticating user: ${credentials.username}`);
        const validationResponse: IValidationResponse =
            await authenticationService.validate(credentials.username, credentials.password);
        if (validationResponse.ok && validationResponse.content) {
            const user = validationResponse.content;
            const body = authenticationService.buildJwtToken(user, JWT_SECRET);
            res.json(body);
        } else {
            res.status(401).json({
                error: validationResponse.message
            });
        }
    }
});

export default router;
