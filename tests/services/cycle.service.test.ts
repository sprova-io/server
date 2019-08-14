import config from '../../src/config';

import { cycle1, cycle2 } from '../fixtures/cycle.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import { FormatInsertManyResult, FormatInsertResult } from "@/utils/responses";
import { Collection, ObjectId } from "mongodb";
import cycleService from "../../src/services/cycle.service";

describe('Cycle', () => {
    let mongod: MongoMemoryServer;
    let Cycles: Collection;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config.db);
            await cycleService.load();

            Cycles = await dbm.getCollection('cycles');
            await Cycles.deleteMany({});
        } catch (e) {
            throw new Error(e);
        }
    });
    describe('Insert One', () => {
        afterEach(async () => {
            await Cycles.deleteMany({});
        });
        test('Insert a new cycle', async () => {
            const result = await cycleService.insertOne(cycle1);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect((result as FormatInsertResult)._id).toBe(cycle1._id);
        });
    });

    afterAll(async (done) => {
        await dbm.disconnect();
        await mongod.stop();
        done();
    });
});
