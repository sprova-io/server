import { Db, MongoClient } from "mongodb";

export interface DatabaseConfig {
  auth?: {
    user: string;
    password: string;
  };
  database: string;
  host: string;
  port: number;
}

class DatabaseManager {
  private client: MongoClient | undefined;

  private db: Db | undefined;

  public async connect(config: DatabaseConfig) {
    const { auth, database, host, port } = config;
    this.client = await MongoClient.connect(this.formatUrl(host, port), {
      auth,
      useNewUrlParser: true
    });
    this.db = this.client.db(database);
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  public async getCollection(name: string) {
    if (!this.db) {
      throw new Error(
        "Trying to access collection without database connection!"
      );
    }
    return this.db.collection(name);
  }

  private formatUrl(host: string, port: number) {
    return `mongodb://${host}:${port}`;
  }
}

export default new DatabaseManager();
