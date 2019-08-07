import config from '../../src/config';

import express, { Application } from 'express';
import request from "supertest";

import { project1, project2 } from '../fixtures/project.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import projectApi from '../../src/api/project.api';

import { Collection } from 'mongodb';

import projectService from '../../src/services/project.service';

describe('Project API Route', () => {
    let app: Application;
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

        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(projectApi);
    });
    afterEach(async () => {
        await Projects.deleteMany({});
    });
    describe('find one project by ID', () => {
        beforeEach(async () => {
            await Projects.insertOne(project1);
        });
        test('return project', async () => {
            const result: any = await request(app).get("/" + project1._id).
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body._id).toBe(project1._id.toHexString());
        });
        test('don\'t return project that does not exist', async () => {
            const result: any = await request(app).get("/abc").
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(400);
        });
    });

    describe('find all projects', () => {
        beforeEach(async () => {
            await Projects.insertOne(project1);
        });
        test('return project', async () => {
            const result: any = await request(app).get("/").
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body).toBeInstanceOf(Array);
            expect(result.body).toHaveLength(1);
            expect(result.body[0]._id).toEqual(project1._id.toHexString());
        });
    });

    describe('search projects', () => {
        beforeEach(async () => {
            await Projects.insertOne(project1);
            await Projects.insertOne(project2);
        });
        test('find project', async () => {
            const result: any = await request(app).search("/").type('json')
                .send({ query: { title: 'Best App' }, options: { limit: 1 } });
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(200);
            expect(result.body).toBeInstanceOf(Array);
            expect(result.body).toHaveLength(1);
            expect(result.body[0]._id).toEqual(project1._id.toHexString());
        });
    });

    describe('post projects', () => {
        test('add new project', async () => {
            const result: any = await request(app).post("/").type('json')
                .send(project1);
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(201);
            expect(result.body.ok).toBeTruthy();
            expect(result.body._id).toEqual(project1._id.toHexString());
        });

        test('add twice a project', async () => {
            const result: any = await request(app).post("/").type('json')
                .send(project1);
            expect(result.type).toBe('application/json');
            expect(result.body).toBeDefined();
            expect(result.status).toBe(201);
            expect(result.body.ok).toBeTruthy();
            expect(result.body._id).toEqual(project1._id.toHexString());

            const result2: any = await request(app).post("/").type('json')
                .send(project1);
            expect(result2.type).toBe('application/json');
            expect(result2.body).toBeDefined();
            expect(result2.status).toBe(500);
            expect(result2.body.ok).toBeFalsy();
            expect(result2.body.error).toMatch(/E11000 duplicate key error/);
        });
    });

    afterAll(async done => {
        await dbm.disconnect();
        await mongod.stop();
        done();
    });
});
