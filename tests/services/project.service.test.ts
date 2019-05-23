import config from '../../src/config';

import { project1, project2 } from '../fixtures/project.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import { FormatInsertResult } from "@/utils/responses";
import { Collection, ObjectId } from "mongodb";
import projectService from "../../src/services/project.service";

describe('Project', () => {
    let mongod: MongoMemoryServer;
    let Projects: Collection;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config.db);
            await projectService.load();

            Projects = await dbm.getCollection('projects');
            await Projects.deleteMany({});
        } catch (e) {
            throw new Error(e);
        }
    });
    describe('Insert', () => {
        afterEach(async () => {
            await Projects.deleteMany({});
        });
        test('Insert a new project', async () => {
            const result = await projectService.insertOne(project1);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect((result as FormatInsertResult)._id).toBe(project1._id);
        });

        test('Throw on insert project with used _id', async () => {
            await Projects.insertOne(project1);
            await expect(projectService.insertOne(project1)).rejects.toThrow();
        });

    });

    describe('Find', () => {
        afterEach(async () => {
            await Projects.deleteMany({});
        });
        test('To findOneById project', async () => {
            await Projects.insertOne(project1);
            const result = await projectService.findOneById(project1._id);
            expect(result).toStrictEqual(project1);
        });

        test('Don\'t findOneById project that does not exist', async () => {
            await Projects.insertOne(project1);
            const result = await projectService.findOneById(new ObjectId());
            expect(result).toBe(null);
        });

        test('To findProjects two', async () => {
            await Projects.insertOne(project1);
            await Projects.insertOne(project2);
            const result = await projectService.find({}, {});
            expect(result).toStrictEqual([project1, project2]);
        });
    });

    afterAll(async () => {
        mongod.stop();
    });
});
