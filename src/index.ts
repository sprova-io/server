import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import jwt from "express-jwt";
import path from 'path';

import { unauthorized } from './utils/http';
import log from './utils/logger';

import authentication from "./api/authentication.api";
import status from "./api/status.api";

import authenticationService from './services/authentication.service';

import dbm from './utils/db';

const PORT = process.env.PORT || 3001;

const app: Application = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/status', status);
app.use('/api/authenticate', authentication);
app.use(jwt({ secret: process.env.JWT_SECRET || 'you-hacker!' }));
app.use(unauthorized());
// authorized APIs

(async function start() {
    log.info('Server connecting to database');
    try {
        await dbm.connect();
        await authenticationService.load();
        log.info('Successfully established database connection');
    } catch (e) {
        log.error(e);
    }
})();

app.listen(PORT, () => {
    log.info(`Example app listening on port ${PORT}`);
});
