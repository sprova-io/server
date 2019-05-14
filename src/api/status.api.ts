import { NextFunction, Request, Response, Router } from 'express';

import { status } from '../services/status.service';
import log from '../utils/logger';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(status());
});

export default router;
