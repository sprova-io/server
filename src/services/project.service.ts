import { ErrorResponse, FormatInsertResult } from '@/utils/responses';
import { Collection, ObjectId } from 'mongodb';
import dbm from '../utils/db';
import { formatDelete, formatInsertOne, formatUpdate } from '../utils/formats';
import log from '../utils/logger';

class ProjectService {
    private readonly collectionName = 'projects';
    private Projects: Collection | any;

    public async load() {
        this.Projects = await dbm.getCollection(this.collectionName);
        log.info("Successfully loaded ProjectService");
    }

    public async find(query: any, options: any) {
        return await this.Projects.find(query, options).toArray();
    }

    public async findOneById(_id: ObjectId) {
        return await this.Projects.findOne({ _id });
    }

    public async insertOne(value: any): Promise<FormatInsertResult> {
        const result = await this.Projects.insertOne(value);
        return formatInsertOne(result);
    }

    public async insertMany(value: any) {
        const result = await this.Projects.insertMany(value);
        return result.ops;
    }

    public async updateOne(_id: ObjectId, value: any) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        const result = await this.Projects.updateOne({ _id }, { $set: value });
        return formatUpdate(result, _id);
    }

    public async deleteOne(_id: ObjectId) {
        const result = await this.Projects.deleteOne({ _id });
        return formatDelete(result, _id);
    }
}

export default new ProjectService();
