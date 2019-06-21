import { NextFunction, Request, Response, Router } from 'express';

import projectService from '../services/project.service';
import log from '../utils/logger';

import { ApiError } from '../utils/errors';
import { parseObjectId } from '../utils/http';

const router = Router();

/**
 * Find projects by query and filter
 */
router.get('/', async (req: Request, res: Response) => {
    const body = req.body;
    const query = body ? body.query : undefined;
    const options = body ? body.options : undefined;
    const result = await projectService.find(query, options);

    res.json(result);
});

/**
 * Find one project by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const _id = parseObjectId(req.params.id);
        const result = await projectService.findOneById(_id);
        res.json(result);
    } catch (e) {
        if (e instanceof ApiError) {
            res.status(e.statusCode).json(e.toJson());
        } else {
            res.status(500).json({ ok: false, message: e.message });
        }
    }

});
export default router;
