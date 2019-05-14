import db from "@/core/db";
import { logger } from "@/core/logger";
import { Collection, FilterQuery, FindOneOptions } from "mongodb";

class ProjectService {
  private Projects: Collection | undefined;

  public async load() {
    this.Projects = await db.getCollection("projects");

    logger.info("Successfully loaded ProjectService");
  }

  public async getProjects(query: any, options?: FindOneOptions) {
    return this.Projects!.find(query, options).toArray();
  }
}

export default new ProjectService();
