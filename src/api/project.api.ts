import { NextFunction, Request, Response, Router } from 'express';

import projectService from '../services/project.service';
import log from '../utils/logger';

import { isEmpty } from 'lodash';
import { ApiError } from '../utils/errors';
import { errorWithMessage, formatIDs, formatInsertOne } from '../utils/formats';
import { parseObjectId } from '../utils/http';
const router = Router();
export default router;

/**
 * @api {get} /api/projects
 *
 * @apiGroup Projects
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/projects?limit=10&skip=20
 *
 * @apiSuccess {array} - list of projects
 */
router.get('/', async (req: Request, res: Response) => {
    const limit = req.query ? Number(req.query.limit) || 0 : 0;
    const skip = req.query ? Number(req.query.skip) || 0 : 0;
    const options = { limit, skip };
    const result = await projectService.find({}, options);

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
            res.status(500).json(errorWithMessage(e.message));
        }
    }

});

/**
 * @api {search} /api/projects
 *
 * @apiGroup Projects
 *
 * @apiExample {curl} Example usage:
 *     curl -i -X SEARCH http://localhost/api/projects
 *
 * @apiSuccess {object} project
 */
router.search('/', async (req: Request, res: Response) => {
    let query = {};
    let options = {};
    if (req.body) {
        query = req.body.query;
        options = req.body.options;
    }

    const result = await projectService.find(query, options);

    res.send(result);
});

/**
 * @api {post} /api/projects Post new project
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}'
 *          -H "Content-Type: application/json" http://localhost/api/projects
 *
 * @apiName postProject
 * @apiGroup Projects
 *
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
router.post('/', async (req: Request, res: Response) => {
    const value = req.body;
    value.createdAt = new Date();

    try {
        const result = await projectService.insertOne(formatIDs(value));
        res.status(201).json(result);
    } catch (e) {
        res.status(500).json(errorWithMessage(e.errmsg));
    }
});

/**
 * @api {put} /api/projects/:id Edit project
 *
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}'
 *          -H "Content-Type: application/json" http://localhost/api/projects/5af582d1dccd6600137334a0
 *
 * @apiName putProject
 * @apiGroup Projects
 *
 * @apiParam {Number} id project's unique ID.
 *
 * @apiSuccess {Boolean} ok true if successful; false if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
router.put('/:id', async (req: Request, res: Response) => {
    const value = req.body;
    if (isEmpty(value)) {
        res.status(400).json(errorWithMessage('cannot PUT with empty body. use DEL instead.'));
    } else {
        value.updatedAt = new Date();

        try {
            const _id = parseObjectId(req.params.id);
            const result = await projectService.updateOneById(_id, formatIDs(value));
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json(errorWithMessage(e.errmsg));
        }
    }
});

/**
 * @api {del} /api/projects/:id Delete project
 *
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/projects/5af582d1dccd6600137334a0
 *
 * @apiName delProject
 * @apiGroup Projects
 *
 * @apiParam {Number} id project's unique ID.
 *
 * @apiSuccess {Boolean} ok true if successful; false if  unsuccessful
 */

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const _id = parseObjectId(req.params.id);
        const result = await projectService.deleteOneById(_id);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json(errorWithMessage(e.errmsg));
    }
});
