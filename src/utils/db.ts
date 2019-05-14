import { MongoClient } from 'mongodb';
import * as config from '../config';
import log from './logger';

class DatabaseManager {
    public config: any;
    public client: any;
    public db: any;

    constructor(configuration: any) {
        log.info('Initializing DB');
        this.config = configuration;
    }

    // TODO: handle replicaSets and shards
    get connectUrl() {
        const { host, port, name } = this.config.db;
        return `mongodb://${host}:${port}/${name}`;
    }

    get mongoOptions() {
        const { mongoOptions } = this.config;
        const { SPROVA_DB_USERNAME, SPROVA_DB_PASSWORD } = process.env;

        const overrides = {
            ...SPROVA_DB_USERNAME && { user: SPROVA_DB_USERNAME },
            ...SPROVA_DB_PASSWORD && { password: SPROVA_DB_PASSWORD }
        };

        return { ...mongoOptions, useNewUrlParser: true, ...overrides };
    }

    /**
     * Asynchronously connect to database.
     *
     * @param {*} configuration Optional config override that can by used for testing.
     */
    public async connect(configuration?: any) {
        if (configuration) {
            this.config = configuration;
        }
        log.info('Connecting to database ' + this.connectUrl);
        const { name } = this.config.db;
        try {
            this.client = await MongoClient.connect(this.connectUrl, this.mongoOptions);
            this.db = this.client.db(name);
            log.info('Successfully connected to database ' + this.connectUrl);
        } catch (error) {
            log.error('%s at %s', error.message, this.connectUrl);
            throw error;
        }
    }

    /**
     * Disconnect client from database.
     */
    public async disconnect() {
        await this.client.close();
    }

    /**
     * Load collection by name.
     *
     * @param {string} name of the collection to load.
     */
    public async getCollection(name: string) {
        if (!this.db) {
            throw new Error('Trying to open collection without database connection!');
        }
        return await this.db.collection(name);
    }

    /**
     * Get current database object.
     */
    public getDB() {
        return this.db;
    }

}

export default new DatabaseManager(config);
