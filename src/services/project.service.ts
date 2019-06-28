import { FormatInsertManyResult, FormatInsertResult } from '@/utils/responses';
import { Collection, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import dbm from '../utils/db';
import { formatDelete, formatInsertMany, formatInsertOne, formatUpdate } from '../utils/formats';
import log from '../utils/logger';

/**
 * Project Service takes care of database operations regarding projects and its relationships.I
 */
class ProjectService {
    private readonly collectionName = 'projects';
    private Projects: Collection | any;

    /**
     * Helper function to load the collection within an async function
     */
    public async load() {
        this.Projects = await dbm.getCollection(this.collectionName);
        log.info("Successfully loaded ProjectService");
    }

    /**
     * Find by filtering data.
     *
     * @param query Query data to pass to collection.find(query,options)
     * @param options Option data to pass to collection.find()
     */
    public async find(query: any, options: any) {
        return await this.Projects.find(query, options).toArray();
    }

    /**
     * Fetch by ID
     *
     * @param _id ObjectId
     */
    public async findOneById(_id: ObjectId) {
        return await this.Projects.findOne({ _id });
    }

    /**
     * Insert one object.
     *
     * @param value Object value
     */
    public async insertOne(value: any): Promise<FormatInsertResult> {
        if (!value) {
            throw new Error('Cannot insert undefined or null');
        }

        const result = await this.Projects.insertOne(value);
        return formatInsertOne(result);
    }

    /**
     * Inserty many objects at a time.
     *
     * @param value Array of objects
     */
    public async insertMany(value: any): Promise<FormatInsertManyResult> {
        if (!value) {
            throw new Error('Cannot insert undefined or null');
        }
        if (!Array.isArray(value)) {
            value = [value];
        }

        const result = await this.Projects.insertMany(value);
        return formatInsertMany(result);
    }

    /**
     * Update fully or partially an object referenced by the gived ObjectId
     *
     * @param _id ObjectId
     * @param value Partial or full object value
     */
    public async updateOneById(_id: ObjectId, value: any) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        const result = await this.Projects.updateOne({ _id }, { $set: value });
        return formatUpdate(result, _id);
    }

    /**
     * Delete permanently an object from the database.
     *
     * @param _id ObjectId
     */
    public async deleteOneById(_id: ObjectId) {
        const result = await this.Projects.deleteOne({ _id });
        return formatDelete(result, _id);
    }
}

export default new ProjectService();
