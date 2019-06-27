import config from '../src/config';

import express, { Application } from 'express';
import { Collection } from 'mongodb';
import request from 'supertest';

import server, { close, initialize, loadServices } from '../src/server';

import { adminUser } from './fixtures/authentication.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../src/utils/db';
import { project1 } from './fixtures/project.fixture';

describe('server.ts', () => {
    let app: Application;
    let mongod: MongoMemoryServer;
    let Users: Collection;
    let Projects: Collection;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config.db);
            await loadServices();
            await initialize();

            Users = await dbm.getCollection('users');
            Projects = await dbm.getCollection('projects');
            await Users.deleteMany({});
            await Projects.deleteMany({});
        } catch (e) {
            throw new Error(e);
        }

        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(server);
    });

    describe('Free routes', () => {
        afterEach(async () => {
            await Users.deleteMany({});
        });

        test('Should offer status information', async () => {
            const result: any = await request(app).get('/api/status').
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.body.running).toBe(true);
            expect(result.status).toBe(200);
        });

        test('Should authenticate ', async () => {
            await Users.insertOne(adminUser);

            const result: any = await request(app).post('/api/authenticate')
                .send({ username: 'admin', password: 'admin' });
            expect(result.type).toBe('application/json');
            expect(result.charset).toBe('utf-8');
            expect(result.body).toBeDefined();
            expect(result.body.message).toBe('Successfully logged in');
            expect(result.body.token).toBeDefined();
            expect(result.body.token).not.toBe('');
            expect(result.status).toBe(200);
        });
    });

    describe('Projects', () => {
        let token: string;

        beforeAll(async () => {
            await Users.insertOne(adminUser);
            await Projects.insertOne(project1);

            const result: any = await request(app).post('/api/authenticate')
                .send({ username: 'admin', password: 'admin' });
            expect(result.body.token).toBeDefined();
            token = result.body.token;
        });
        test('Should fetch project', async () => {
            const result: any = await request(app)
                .get(`/api/projects/${project1._id}`)
                .set('Authorization', 'bearer ' + token);
            expect(result.body).toBeDefined();
            expect(result.body._id).toBe(project1._id.toHexString());
            expect(result.status).toBe(200);
        });
        test('Should return unauthorized to fetch project', async () => {
            const result: any = await request(app)
                .get(`/api/projects/${project1._id}`);
            expect(result.body).toEqual({ message: 'Authentication failed', ok: false });
            expect(result.status).toBe(401);
        });
    });

    afterAll(async done => {
        await close();
        done();
    });
});
