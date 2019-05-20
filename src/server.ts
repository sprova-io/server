import * as config from './config';

import cors from 'cors';
import express, { Application } from 'express';
import jwt from "express-jwt";
import { Server } from 'http';
import path from 'path';

import { unauthorized } from './utils/http';
import log, { expressLogger } from './utils/logger';

import authentication from "./api/authentication.api";
import status from "./api/status.api";

import authenticationService from './services/authentication.service';

import dbm from './utils/db';

const PORT = process.env.PORT || 8000;

const app: Application = express();

// Pre authentication middleware
app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/status", status);
app.use("/api/authenticate", authentication);

// Middleware
app.use(jwt({ secret: process.env.JWT_SECRET || "you-hacker!" }));
app.use(unauthorized());
app.use(express.static(path.join(__dirname, "public")));

// Authorized Routes

// Some services due to lack of asynchronity in constructor
// need to be loaded after DB connection has been setup
export const loadServices = async () => {
  await authenticationService.load();
};

(async function start() {
  log.info('Server connecting to database');
  try {
    await dbm.connect();
    await loadServices();
    log.info('Successfully established database connection');
  } catch (e) {
    log.error(e);
  }
})();

// Start Server
const server: Server = app.listen(PORT, () => {
  log.info(`Example app listening on port ${PORT}`);
});

export const close = async () => {
  server.close();
  await dbm.disconnect();
};

export default app;
