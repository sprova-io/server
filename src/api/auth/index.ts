import { logger } from "@/core/logger";
import * as express from "express";

const authApi = express.Router();

authApi.post("/login", login);
authApi.post("/signup", signup);

async function login(req: express.Request, res: express.Response) {
  logger.info("Login");
  res.send("Login");
}

async function signup(req: express.Request, res: express.Response) {
  logger.info("Signup");
  res.send("Signup");
}

export default authApi;
