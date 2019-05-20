import config from '../../src/config';

// const config = { db: { host: '127.0.0.1', port: 0, name: '' } };
import { adminUser, signUpUser } from '../fixtures/authentication.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import { IUser } from '@/models';
import authenticationService from "../../src/services/authentication.service";

describe('Authentication', () => {
    let mongod: MongoMemoryServer;
    let Users: any;
    beforeAll(async () => {
        try {
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            config.db.port = await mongod.getPort();
            config.db.name = await mongod.getDbName();

            await dbm.connect(config.db);
            await authenticationService.load();

            Users = await dbm.getCollection('users');
            await Users.deleteMany();
        } catch (e) {
            throw new Error(e);
        }
    });
    describe('Validation', () => {
        afterEach(async () => {
            await Users.deleteMany();
        });
        test('should validate admin', async () => {
            await Users.insertOne(adminUser);
            const result = await authenticationService.validate('admin', 'admin');
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect(result.message).toBe('Successfully authenticated');
        });

        test('should not validate empty username', async () => {
            const result = await authenticationService.validate('', 'admin');
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Username cannot be empty');
        });

        test('should not validate wrong username', async () => {
            const result = await authenticationService.validate('notadmin', 'admin');
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Username not found');
        });

        test('should not validate empty password', async () => {
            const result = await authenticationService.validate('admin', '');
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Password cannot be empty');
        });

    });
    describe('Sign-Up', () => {
        test('should not sign up with empty username', async () => {
            delete signUpUser.username;
            const result = await authenticationService.signUp(signUpUser);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Username cannot be empty');
        });
        test('should not sign up empty password', async () => {
            signUpUser.username = 'bob';
            delete signUpUser.password;
            const result = await authenticationService.signUp(signUpUser);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Password cannot be empty');
        });
    });

    afterAll(async () => {
        mongod.stop();
    });
});
