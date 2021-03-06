import { FormatInsertManyResult, FormatInsertResult } from '@/utils/responses';
import { Collection, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import dbm from '../utils/db';
import { formatDelete, formatInsertMany, formatInsertOne, formatUpdate } from '../utils/formats';
import log from '../utils/logger';
import GenericService from './generic.service';

/**
 * Project Service takes care of database operations regarding projects and its relationships.I
 */
class ProjectService extends GenericService {
    constructor() {
        super('projects');
    }
}

export default new ProjectService();
