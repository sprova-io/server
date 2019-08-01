import { NextFunction, Request, Response, Router } from 'express';

import projectService from '../services/project.service';
import log from '../utils/logger';

import { ApiError } from '../utils/errors';
import { parseObjectId } from '../utils/http';

const router = Router();

/**
 * @api {get} /api/projects
 *
 * @apiGroup Projects
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/projects
 *
 * @apiSuccess {array} - list of projects
 */
router.get('/', async (req: Request, res: Response) => {
    const params = req.params;
    const query = params && params.query ? JSON.parse(params.query) : undefined;
    const options = params && params.options ? JSON.parse(params.options) : undefined;
    const result = await projectService.find(query, options);

    res.json(result);
});

/**
 * @api {get} /api/projects/:id
 *
 * @apiGroup Projects
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/projects/5af582d1dccd6600137334a0
 *
 * @apiSuccess {object} project
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

router.search('/', async (req: Request, res: Response) => {

});

export default router;
