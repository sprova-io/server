import db from "@/core/db";
import { logger } from "@/core/logger";
import { Collection, FilterQuery, FindOneOptions, ObjectID } from "mongodb";
import { Project } from "sprova-types";

class ProjectService {
  private Projects: Collection | undefined;

  public async load() {
    this.Projects = await db.getCollection("projects");

    logger.info("Successfully loaded ProjectService");
  }

  public async getProjects(
    query: FilterQuery<Project>,
    options?: FindOneOptions
  ): Promise<Project[]> {
    return await this.Projects!.find<Project>(query, options).toArray();
  }

  public async getProject(projectId: string): Promise<Project | null> {
    const _id = new ObjectID(projectId);
    return await this.Projects!.findOne<Project>({ _id });
  }

  public async postProject(project: Project): Promise<Project> {
    const result = await this.Projects!.insertOne(project);
    return result.ops[0];
  }
}

export default new ProjectService();
