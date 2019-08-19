import * as config from '../config';

import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import log from './logger';

const DEFAULT_RETRY_TIMES = 5;
const DEFAULT_RETRY_INTERVAL_SECONDS = 3;

class DatabaseManager {
    public config: any;
    public options: any;
    private db: Db | any;
    private client: MongoClient | any;
    private retryInterval = DEFAULT_RETRY_INTERVAL_SECONDS;
    private retryTimes = DEFAULT_RETRY_TIMES;

    constructor(configuration: any, options: any) {
        log.info('Initializing DB');
        this.config = configuration;
        this.options = options;
        this.retryTimes = configuration.retryTimes || DEFAULT_RETRY_TIMES;
        this.retryInterval = configuration.retryInterval || DEFAULT_RETRY_INTERVAL_SECONDS;
    }

    // TODO: handle replicaSets and shards
    get connectUrl() {
        const { host, port, name } = this.config;
        return `mongodb://${host}:${port}/${name}`;
    }

    get mongoOptions(): MongoClientOptions {
        const { SPROVA_DB_USERNAME, SPROVA_DB_PASSWORD } = process.env;

        const overrides = {
            ...SPROVA_DB_USERNAME && { user: SPROVA_DB_USERNAME },
            ...SPROVA_DB_PASSWORD && { password: SPROVA_DB_PASSWORD }
        };

        return { ...this.options, useNewUrlParser: true, ...overrides };
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

        let retry = this.retryTimes;

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
                log.warn(error.message + ', retrying in ' + retry + ' seconds');
                await new Promise(resolve => setTimeout(resolve, retry * 1000));
            }
        } while (!this.client && --retry > 0);

        // in case still there is no connection then we throw an error
        if (!this.client) {
            throw new Error('Could not establish database connection after retrying '
                + this.retryTimes + ' times');
        }
    }

    /**
     * Disconnect client from database.
     */
    public async disconnect() {
        if (this.client && this.client.isConnected()) {
            await this.client.close();
        } else {
            throw new Error('Attempting to close a DB connection which does not exist.');
        }
    }

    /**
     * Load collection by name.
     *
     * @param {string} name of the collection to load.
     */
    public async getCollection(name: string) {
        if (!this.db) {
            throw new Error(`Trying to open collection ${name} without database connection!`);
        }
        return await this.db.collection(name);
    }
}

export default new DatabaseManager(config.default.db, config.default.mongoOptions);
