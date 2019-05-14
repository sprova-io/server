import db from "@/core/db";
import { logger } from "@/core/logger";
import { Collection, FilterQuery, FindOneOptions } from "mongodb";
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
    return this.Projects!.find(query, options).toArray();
  }
}

export default new ProjectService();
