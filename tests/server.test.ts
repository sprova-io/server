import express, { Application } from 'express';
import request from "supertest";

import server, { close, loadServices } from '../src/server';

import { adminUser } from './fixtures/authentication.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../src/utils/db';
const config = { db: { host: '127.0.0.1', port: 0, name: '' } };

describe('server.ts', () => {
    let app: Application;
    let mongod: MongoMemoryServer;
    let Users: any;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config);
            await loadServices();

            Users = await dbm.getCollection('users');
            await Users.deleteMany();
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
            await Users.deleteMany();
        });

        test('Should offer status information', async () => {
            const result: any = await request(app).get("/api/status").
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).not.toBe(undefined);
            expect(result.body.running).toBe(true);
            expect(result.status).toBe(200);
        });

        test('Should authenticate ', async () => {
            await Users.insertOne(adminUser);

            const result: any = await request(app).post("/api/authenticate")
                .send({ username: 'admin', password: 'admin' });
            expect(result.type).toBe('application/json');
            expect(result.charset).toBe('utf-8');
            expect(result.body).not.toBe(undefined);
            expect(result.body.message).toBe('Successfully logged in');
            expect(result.body.token).not.toBe(undefined);
            expect(result.body.token).not.toBe('');
            expect(result.status).toBe(200);
        });
    });

    afterAll(async () => {
        close();
    });
});
