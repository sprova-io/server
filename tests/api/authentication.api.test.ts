import express, { Application } from 'express';
import request from "supertest";

import { adminUser } from '../fixtures/authentication.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';
const config = { db: { host: '127.0.0.1', port: 0, name: '' } };

import authentication from '../../src/api/authentication.api';
import authenticationService from "../../src/services/authentication.service";

describe('Authentication API Route', () => {
    let app: Application;
    let mongod: MongoMemoryServer;
    let Users: any;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config);
            await authenticationService.load();

            Users = await dbm.getCollection('users');
            await Users.deleteMany();
        } catch (e) {
            throw new Error(e);
        }

        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(authentication);
    });
    describe('authenticate() function', () => {
        afterEach(async () => {
            await Users.deleteMany();
        });
        test('Should authenticate ', async () => {
            await Users.insertOne(adminUser);

            const result: any = await request(app).post("/")
                .send({ username: 'admin', password: 'admin' });
            expect(result.type).toBe('application/json');
            expect(result.charset).toBe('utf-8');
            expect(result.body).not.toBe(undefined);
            expect(result.body.message).toBe('Successfully logged in');
            expect(result.body.token).not.toBe(undefined);
            expect(result.body.token).not.toBe('');
            expect(result.status).toBe(200);
        });
        test('Should not authenticate ', async () => {
            await Users.insertOne(adminUser);

            const result: any = await request(app).post("/")
                .send({ username: 'admin', password: 'notadmin' });
            expect(result.type).toBe('application/json');
            expect(result.charset).toBe('utf-8');
            expect(result.body).not.toBe(undefined);
            expect(result.body.error).toBe('Incorrect password');
            expect(result.body.token).toBe(undefined);
            expect(result.status).toBe(401);
        });
    });

    afterAll(async () => {
        mongod.stop();
    });
});