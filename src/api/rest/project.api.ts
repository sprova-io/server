import { logger } from "@/core/logger";
import { projectService } from "@/services/db";
import * as express from "express";

const projectApi = express.Router();

projectApi.get("/projects", getProjects);
projectApi.get("/projects/:id", getProject);
projectApi.post("/projects", postProject);
projectApi.put("/projects/:id", putProject);
projectApi.delete("/projects/:id", deleteProject);

async function getProjects(req: express.Request, res: express.Response) {
  try {
    const projects = await projectService.getProjects(req.query);
    res.send(projects);
  } catch (error) {
    res.send(error);
  }
}

async function getProject(req: express.Request, res: express.Response) {
  logger.info("Get Project");
  res.send("Get Project");
}

async function putProject(req: express.Request, res: express.Response) {
  logger.info("Put Project");
  res.send("Put Projecs");
}

async function postProject(req: express.Request, res: express.Response) {
  logger.info("Post Project");
  res.send("Post Projecs");
}

async function deleteProject(req: express.Request, res: express.Response) {
  logger.info("Delete Project");
  res.send("Delete Projecs");
}

export default projectApi;
