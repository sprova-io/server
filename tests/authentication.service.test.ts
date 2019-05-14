const config = { db: { host: '127.0.0.1', port: 0, name: '' } };
import { adminUser } from './fixtures/authentication.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../src/utils/db';

import authenticationService from "../src/services/authentication.service";

describe('Validation', () => {
    let mongod: MongoMemoryServer;
    let Users: any;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config);
            await authenticationService.load();

            Users = await dbm.getCollection('users');
            await Users.deleteMany();
        } catch (e) {
            throw new Error(e);
        }
    });

    test('should validate admin', async () => {
        await Users.insertOne(adminUser);
        const result = await authenticationService.validate('admin', 'admin');
        expect(result).not.toBe(undefined);
        expect(result.ok).toBe(1);
        expect(result.message).toBe('Successfully authenticated');
    });

    test('should not validate empty username', async () => {
        const result = await authenticationService.validate('', 'admin');
        expect(result).not.toBe(undefined);
        expect(result.ok).toBe(0);
        expect(result.message).toBe('Username cannot be empty');
    });

    test('should not validate empty username', async () => {
        const result = await authenticationService.validate('notadmin', 'admin');
        expect(result).not.toBe(undefined);
        expect(result.ok).toBe(0);
        expect(result.message).toBe('Username not found');
    });

    test('should not validate empty username', async () => {
        const result = await authenticationService.validate('admin', '');
        expect(result).not.toBe(undefined);
        expect(result.ok).toBe(0);
        expect(result.message).toBe('Password cannot be empty');
    });

    afterAll(async () => {
        mongod.stop();
      });
});
