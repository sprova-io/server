import { NextFunction, Request, Response, Router } from 'express';

import projectService from '../services/project.service';
import log from '../utils/logger';

import { ObjectId } from 'mongodb';

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
    const result = await projectService.findOneById(new ObjectId(req.params.id));

    res.json(result);
});
export default router;
