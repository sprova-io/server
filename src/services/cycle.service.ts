import { FormatInsertManyResult, FormatInsertResult } from '@/utils/responses';
import { Collection, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import dbm from '../utils/db';
import { formatDelete, formatInsertMany, formatInsertOne, formatUpdate } from '../utils/formats';
import log from '../utils/logger';
import GenericService from './generic.service';

/**
 * Cycle Service takes care of database operations regarding cycles and its relationships.I
 */
class CycleService extends GenericService {
    constructor() {
        super('cycles');
    }
}

export default new CycleService();
