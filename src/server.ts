import authApi from "@/api/auth";
import restApi from "@/api/rest";
import db from "@/core/db";
import { expressLogger, logger } from "@/core/logger";
import authenticationService from "@/services/authentication.service";
import { projectService } from "@/services/db";
import cors from "cors";
import { config, DotenvConfigOutput } from "dotenv";
import express from "express";
import fs from "fs";
import http from "http";
import path from "path";

import jwt from "express-jwt";
import authentication from "./api/authentication.api";
import status from "./api/status.api";
import { unauthorized } from "./utils/http";

const DOTENV_FILE = "./.env";

if (fs.existsSync(DOTENV_FILE)) {
  logger.info("Read environment variables from .env");
  const dotenvResult: DotenvConfigOutput = config();

  if (dotenvResult.error) {
    logger.warn(`Could not read environment variables: ${dotenvResult.error}`);
  }
}

if (!process.env.PORT) {
  logger.warn("No PORT specified, fall back to default value `8000`");
}

const PORT = process.env.PORT || 8000;

const app = express();

const server = http.createServer(app);

// app.use("/api/status", status);
// app.use("/api/authenticate", authentication);
// app.use(jwt({ secret: process.env.JWT_SECRET || "you-hacker!" }));
// app.use(unauthorized());

/**
 * Middleware
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLogger);

/**
 * Routes
 */
app.use("/auth", authApi);
app.use("/api", restApi);

const boot = async () => {
  logger.info("Boot server");

  logger.info("Connect to database");

  try {
    if (!process.env.DB_NAME) {
      logger.warn("No DB_NAME specified, fall back to default value `sprova`");
    }

    if (!process.env.DB_HOST) {
      logger.warn(
        "No DB_HOST specified, fall back to default value `localhost`"
      );
    }

    if (!process.env.DB_PORT) {
      logger.warn("No DB_PORT specified, fall back to default value `27017`");
    }

    const { DB_USER, DB_PASSWORD } = process.env;
    const auth = DB_USER &&
      DB_PASSWORD && { user: DB_USER, password: DB_PASSWORD };

    await db.connect({
      database: process.env.DB_NAME || "sprova",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || "27017"),
      ...(auth && { auth })
    });

    logger.info("Successfully established database connection");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  logger.info("Load database services");

  try {
    // await authenticationService.load();
    await projectService.load();

    logger.info("All database services loaded");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  run();
};

const run = () => {
  logger.info("Start server");
  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

boot();
