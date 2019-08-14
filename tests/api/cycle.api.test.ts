import config from '../../src/config';

import express, { Application } from 'express';
import request from "supertest";

import { cycle1, cycle2 } from '../fixtures/cycle.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import cycleApi from '../../src/api/cycle.api';

import { Collection } from 'mongodb';

import cycleService from '../../src/services/cycle.service';

describe('Cycle API Route', () => {
    let app: Application;
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

        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cycleApi);
    });
    afterEach(async () => {
        await Cycles.deleteMany({});
    });
    describe('find one cycle by ID', () => {
        beforeEach(async () => {
            await Cycles.insertOne(cycle1);
        });
        test('return cycle', async () => {
            const result: any = await request(app).get("/" + cycle1._id).
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body._id).toBe(cycle1._id.toHexString());
        });
        test('don\'t return cycle that does not exist', async () => {
            const result: any = await request(app).get("/abc").
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(400);
        });
    });

    describe('find all cycles', () => {
        beforeEach(async () => {
            await Cycles.insertOne(cycle1);
        });
        test('return cycle', async () => {
            const result: any = await request(app).get("/").
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body).toBeInstanceOf(Array);
            expect(result.body).toHaveLength(1);
            expect(result.body[0]._id).toEqual(cycle1._id.toHexString());
        });
    });

    describe('search cycles', () => {
        beforeEach(async () => {
            await Cycles.insertOne(cycle1);
            await Cycles.insertOne(cycle2);
        });
        test('find cycle', async () => {
            const result: any = await request(app).search("/").type('json')
                .send({ query: { title: cycle1.title }, options: { limit: 1 } });
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body).toBeInstanceOf(Array);
            expect(result.body).toHaveLength(1);
            expect(result.body[0]._id).toEqual(cycle1._id.toHexString());
        });
    });

    describe('post cycles', () => {
        test('add new cycle', async () => {
            const result: any = await request(app).post("/").type('json')
                .send(cycle1);
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(201);
            expect(result.body.ok).toBeTruthy();
            expect(result.body._id).toEqual(cycle1._id.toHexString());
        });

        test('add twice a cycle', async () => {
            const result: any = await request(app).post("/").type('json')
                .send(cycle1);
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(201);
            expect(result.body.ok).toBeTruthy();
            expect(result.body._id).toEqual(cycle1._id.toHexString());

            const result2: any = await request(app).post("/").type('json')
                .send(cycle1);
            expect(result2.type).toBe('application/json');
            expect(result2.body).toBeDefined();
            expect(result2.status).toBe(500);
            expect(result2.body.ok).toBeFalsy();
            expect(result2.body.message).toMatch(/E11000 duplicate key error/);
        });
    });

    describe('put cycles', () => {
        beforeEach(async () => {
            await Cycles.insertOne(cycle1);
        });
        test('edit new cycle', async () => {
            const newTitle = 'great-change';
            const result: any = await request(app)
                .put("/" + cycle1._id)
                .type('json').send({ title: newTitle });
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body.ok).toBeTruthy();
            expect(result.body._id).toEqual(cycle1._id.toHexString());
            const newCycleResult: any = await request(app).get("/" + cycle1._id);
            expect(newCycleResult.body.title).toEqual(newTitle);
        });

        test('put empty body', async () => {
            const result: any = await request(app)
                .put("/" + cycle1._id)
                .type('json').send();
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(400);
            expect(result.body.ok).toBeFalsy();
            expect(result.body.message).toEqual('cannot PUT with empty body. use DEL instead.');
        });
    });

    describe('delete cycles', () => {
        beforeEach(async () => {
            await Cycles.insertOne(cycle1);
        });
        test('edit new cycle', async () => {
            const result: any = await request(app)
                .del("/" + cycle1._id);
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body.ok).toBeTruthy();
            expect(result.body._id).toEqual(cycle1._id.toHexString());
            const newCycleResult: any = await request(app).get("/" + cycle1._id);
            expect(newCycleResult.body).toBeNull();
        });
    });

    afterAll(async done => {
        await dbm.disconnect();
        await mongod.stop();
        done();
    });
});
