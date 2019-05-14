import express, { Application } from 'express';
import request from "supertest";

import status from '../src/api/status.api';

describe('Status API Route',  () => {
    let app: Application;
    beforeAll(() => {
        app = express();
        app.use(status);
    });
    describe('status() function', () => {
        test('Should error out if no name provided ', async () => {
            const result: any = await request(app).get("/").
            expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).not.toBe(undefined);
            expect(result.body.running).toBe(true);
            expect(result.status).toBe(200);
        });
    });
});
