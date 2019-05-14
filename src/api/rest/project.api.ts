import { logger } from "@/core/logger";
import { projectService } from "@/services/db";
import express, { Request, Response } from "express";
import { Project } from "sprova-types";

const projectApi = express.Router();

projectApi.get("/projects", getProjects);
projectApi.get("/projects/:id", getProject);
projectApi.post("/projects", postProject);
projectApi.put("/projects/:id", putProject);
projectApi.delete("/projects/:id", deleteProject);

async function getProjects(req: Request, res: Response) {
  try {
    const projects = await projectService.getProjects(req.query);
    res.json(projects);
  } catch (error) {
    res.send(error);
  }
}

async function getProject(req: Request, res: Response) {
  const { id: projectId } = req.params;

  try {
    const project = await projectService.getProject(projectId);
    res.json(project);
  } catch (error) {
    res.send(error);
  }
}

async function postProject(req: Request, res: Response) {
  const project: Project = req.body;

  try {
    const insertedProject = await projectService.postProject(project);
    res.status(201);
    res.json(insertedProject);
  } catch (error) {
    res.send(error);
  }
}

async function putProject(req: Request, res: Response) {
  logger.info("Put Project");
  res.send("Put Projecs");
}

async function deleteProject(req: Request, res: Response) {
  logger.info("Delete Project");
  res.send("Delete Projecs");
}

export default projectApi;
