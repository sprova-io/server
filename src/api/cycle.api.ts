import { NextFunction, Request, Response, Router } from 'express';

import cycleService from '../services/cycle.service';
import log from '../utils/logger';

import { isEmpty } from 'lodash';
import { ApiError, handleError } from '../utils/errors';
import { errorWithMessage, formatIDs, formatInsertOne } from '../utils/formats';
import { parseObjectId } from '../utils/http';
const router = Router();
export default router;

/**
 * @api {get} /api/cycles
 *
 * @apiGroup Cycles
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/cycles?limit=10&skip=20
 *
 * @apiSuccess {array} - list of cycles
 */
router.get('/', async (req: Request, res: Response) => {
    const limit = req.query ? Number(req.query.limit) || 0 : 0;
    const skip = req.query ? Number(req.query.skip) || 0 : 0;
    const options = { limit, skip };
    const result = await cycleService.find({}, options);

    res.json(result);
});

/**
 * @api {get} /api/cycles/:id
 *
 * @apiGroup Cycles
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/cycles/5af582d1dccd6600137334a0
 *
 * @apiSuccess {object} cycle
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const _id = parseObjectId(req.params.id);
        const result = await cycleService.findOneById(_id);
        res.json(result);
    } catch (e) {
        handleError(res, e);
    }

});

/**
 * @api {search} /api/cycles
 *
 * @apiGroup Cycles
 *
 * @apiExample {curl} Example usage:
 *     curl -i -X SEARCH http://localhost/api/cycles
 *
 * @apiSuccess {object} cycle
 */
router.search('/', async (req: Request, res: Response) => {
    let query = {};
    let options = {};
    if (req.body) {
        query = req.body.query;
        options = req.body.options;
    }

    const result = await cycleService.find(query, options);

    res.send(result);
});

/**
 * @api {post} /api/cycles Post new cycle
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}'
 *          -H "Content-Type: application/json" http://localhost/api/cycles
 *
 * @apiName postCycle
 * @apiGroup Cycles
 *
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
router.post('/', async (req: Request, res: Response) => {
    const value = req.body;
    value.createdAt = new Date();

    try {
        const result = await cycleService.insertOne(formatIDs(value));
        res.status(201).json(result);
    } catch (e) {
        handleError(res, e);
    }
});

/**
 * @api {put} /api/cycles/:id Edit cycle
 *
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}'
 *          -H "Content-Type: application/json" http://localhost/api/cycles/5af582d1dccd6600137334a0
 *
 * @apiName putCycle
 * @apiGroup Cycles
 *
 * @apiParam {Number} id cycle's unique ID.
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
            const result = await cycleService.updateOneById(_id, formatIDs(value));
            res.status(200).json(result);
        } catch (e) {
            handleError(res, e);
        }
    }
});

/**
 * @api {del} /api/cycles/:id Delete cycle
 *
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/cycles/5af582d1dccd6600137334a0
 *
 * @apiName delCycle
 * @apiGroup Cycles
 *
 * @apiParam {Number} id cycle's unique ID.
 *
 * @apiSuccess {Boolean} ok true if successful; false if  unsuccessful
 */

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const _id = parseObjectId(req.params.id);
        const result = await cycleService.deleteOneById(_id);
        res.status(200).json(result);
    } catch (e) {
        handleError(res, e);
    }
});
