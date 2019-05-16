import express, { Application } from 'express';
import request from "supertest";

import server from '../src/server';

describe('server.ts', () => {
    let app: Application;
    beforeAll(() => {
        app = express();
        app.use(server);
    });
    describe('Free routes', () => {
        test('Should offer status information', async () => {
            const result: any = await request(app).get("/api/status").
                expect('Content-Type', 'application/json; charset=utf-8');
            expect(result.body).not.toBe(undefined);
            expect(result.body.running).toBe(true);
            expect(result.status).toBe(200);
        });
    });
});
