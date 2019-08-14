import config from '../../src/config';

import { generic1, generic2 } from '../fixtures/generic.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import { FormatInsertManyResult, FormatInsertResult } from "@/utils/responses";
import { Collection, ObjectId } from "mongodb";
import GenericService from "../../src/services/generic.service";

describe('Generic', () => {
    let mongod: MongoMemoryServer;
    let Generics: Collection;
    let genericService: GenericService;
    beforeAll(async () => {
        try {
            genericService = new GenericService('generics');
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config.db);
            await genericService.load();

            Generics = await dbm.getCollection('generics');
            await Generics.deleteMany({});
        } catch (e) {
            throw new Error(e);
        }
    });
    describe('Insert One', () => {
        afterEach(async () => {
            await Generics.deleteMany({});
        });
        test('Insert a new generic', async () => {
            const result = await genericService.insertOne(generic1);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect((result as FormatInsertResult)._id).toBe(generic1._id);
        });

        test('Throw on insert generic with used _id', async () => {
            await Generics.insertOne(generic1);
            await expect(genericService.insertOne(generic1)).rejects.toThrow();
        });

        test('Throw on insert generic undefined or null', async () => {
            await expect(genericService.insertOne(undefined)).rejects.toThrow();
            await expect(genericService.insertOne(null)).rejects.toThrow();
        });

    });

    describe('Insert Many', () => {
        afterEach(async () => {
            await Generics.deleteMany({});
        });
        test('Insert two new generics', async () => {
            const result = await genericService.insertMany([generic1, generic2]);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect((result as FormatInsertManyResult)._ids).toStrictEqual([generic1._id, generic2._id]);
        });

        test('Insert one new generic', async () => {
            const result = await genericService.insertMany(generic1);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect((result as FormatInsertManyResult)._ids).toStrictEqual([generic1._id]);
        });

        test('Throw on insert generics undefined or null', async () => {
            await expect(genericService.insertMany(undefined)).rejects.toThrow();
            await expect(genericService.insertMany(null)).rejects.toThrow();
        });
    });

    describe('Find', () => {
        afterEach(async () => {
            await Generics.deleteMany({});
        });
        test('To findOneById() generic', async () => {
            await Generics.insertOne(generic1);
            const result = await genericService.findOneById(generic1._id);
            expect(result).toStrictEqual(generic1);
        });

        test('To fail on invalid _id', async () => {
            await Generics.insertOne(generic1);
            const _id: any = '';
            const result = await genericService.findOneById(_id);
            expect(result).toBeNull();
        });

        test('Don\'t findOneById() generic that does not exist', async () => {
            await Generics.insertOne(generic1);
            const result = await genericService.findOneById(new ObjectId());
            expect(result).toBe(null);
        });

        test('To findGenerics() two', async () => {
            await Generics.insertOne(generic1);
            await Generics.insertOne(generic2);
            const result = await genericService.find({}, {});
            expect(result).toStrictEqual([generic1, generic2]);
        });
    });

    describe('Update', () => {
        afterEach(async () => {
            await Generics.deleteMany({});
        });
        test('To updateOne() generic', async () => {
            const newTitle = 'updated';
            await Generics.insertOne(generic1);
            const result = await genericService.updateOneById(generic1._id, { title: newTitle });
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            const updatedGeneric1 = await Generics.findOne({ _id: generic1._id });
            expect(updatedGeneric1.title).toBe(newTitle);
        });
    });

    describe('Delete', () => {
        afterEach(async () => {
            await Generics.deleteMany({});
        });
        test('To deleteOneById() generic', async () => {
            await Generics.insertOne(generic1);
            const result = await genericService.deleteOneById(generic1._id);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            const deletedGeneric1 = await Generics.findOne({ _id: generic1._id });
            expect(deletedGeneric1).toBe(null);
        });
    });

    afterAll(async (done) => {
        await dbm.disconnect();
        await mongod.stop();
        done();
    });
});
