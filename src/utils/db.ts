import * as config from '../config';

import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import log from './logger';

const DEFAULT_RETRY_TIMES = 5;
const DEFAULT_RETRY_INTERVAL_SECONDS = 3;

class DatabaseManager {
    private db: Db | any;
    private client: MongoClient | any;
    private config: any;
    private retryInterval = DEFAULT_RETRY_INTERVAL_SECONDS;
    private retryTimes = DEFAULT_RETRY_TIMES;

    constructor(configuration: any) {
        log.info('Initializing DB');
        this.config = configuration;
        this.retryTimes = configuration.retryTimes || DEFAULT_RETRY_TIMES;
        this.retryInterval = configuration.retryInterval || DEFAULT_RETRY_INTERVAL_SECONDS;
    }

    // TODO: handle replicaSets and shards
    get connectUrl() {
        const { host, port, name } = this.config;
        return `mongodb://${host}:${port}/${name}`;
    }

    get mongoOptions(): MongoClientOptions {
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
            this.retryTimes = configuration.retryTimes || DEFAULT_RETRY_TIMES;
            this.retryInterval = configuration.retryInterval || DEFAULT_RETRY_INTERVAL_SECONDS;
        }

        log.info('Connecting to database ' + this.connectUrl);
        const { name } = this.config;
        do {
            try {
                if (this.client && this.client.isConnected()) {
                    this.client.close();
                }
                this.client = await MongoClient.connect(this.connectUrl, this.mongoOptions);
                this.db = this.client.db(name);
                log.info('Successfully connected to database ' + this.connectUrl);
            } catch (error) {
                log.error(error.message + ', retrying in ' + this.retryInterval + ' seconds');
                await new Promise(resolve => setTimeout(resolve, this.retryInterval * 1000));
            }
        } while (!this.client && --this.retryTimes > 0);
    }

    /**
     * Disconnect client from database.
     */
    public async disconnect() {
        if (this.client && this.client.isConnected()) {
            await this.client.close();
        } else {
            log.warn('Attempting to close a DB connection which does not exist.');
        }
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
