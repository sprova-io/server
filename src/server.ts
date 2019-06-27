import * as config from './config';

import cors from 'cors';
import express, { Application } from 'express';
import jwt from 'express-jwt';
import { Server } from 'http';
import path from 'path';

import { unauthorized } from './utils/http';
import log, { expressLogger } from './utils/logger';

import { authenticationRouter } from './api/authorization.api';
import projectRouter from './api/project.api';
import status from './api/status.api';

import authenticationService from './services/authorization.service';
import projectService from './services/project.service';

import dbm from './utils/db';

const MODE = process.env.NODE_ENV || 'development';
const TEST_MODE = MODE === 'test';
const PORT = process.env.PORT || 8000;

const app: Application = express();

// Pre authentication middleware
app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/status', status);
app.use('/api/authenticate', authenticationRouter);

// Middleware
app.use(jwt({ secret: process.env.JWT_SECRET || 'you-hacker!' }));
app.use(unauthorized());
app.use(express.static(path.join(__dirname, 'public')));

// Authorized Routes
app.use('/api/projects', projectRouter);

// Some services due to lack of asynchronity in constructor
// need to be loaded after DB connection has been setup
export const loadServices = async () => {
  await authenticationService.load();
  await projectService.load();
};

export const initialize = async () => {
  log.info('Server connecting to database');
  try {
    await dbm.connect();
    await loadServices();
    log.info('Successfully established database connection');
  } catch (e) {
    log.error('Server could not start. Exiting.');
    log.error(e.message);
    close();
  }
};

if (!TEST_MODE) {
  initialize();
}

// Start Server
const server: Server = app.listen(PORT, () => {
  log.info(`Example app listening on port ${PORT}`);
});

export const close = async (): Promise<void> => {
  server.close();
  return dbm.disconnect();
};

export default app;
