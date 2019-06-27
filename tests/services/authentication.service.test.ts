import { cloneDeep } from "lodash";
import config from '../../src/config';

// const config = { db: { host: '127.0.0.1', port: 0, name: '' } };
import { adminUser, signUpUser } from '../fixtures/authentication.fixture';

// mocks
import { MongoMemoryServer } from 'mongodb-memory-server';
import dbm from '../../src/utils/db';

import authenticationService from "../../src/services/authorization.service";

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
        beforeEach(async () => {
            await Users.deleteMany();
        });
        test('should sign up', async () => {
            const result = await authenticationService.signUp(signUpUser);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect(result.message).toBe('Successfully signed up. Waiting for Response.');
            const addedUsers = await Users.findOne({ username: signUpUser.username });
            expect(addedUsers).not.toBe(undefined);
        });

        test('should not sign up same user', async () => {
            const result = await authenticationService.signUp(signUpUser);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect(result.message).toBe('Successfully signed up. Waiting for Response.');
            const addedUsers = await Users.findOne({ username: signUpUser.username });
            expect(addedUsers).not.toBe(undefined);
            const retryResult = await authenticationService.signUp(signUpUser);
            expect(retryResult).not.toBe(undefined);
            expect(retryResult.ok).toBe(false);
            expect(retryResult.message).toBe('Username already taken');
        });

        test('should not sign up same e-mail', async () => {
            const user = cloneDeep(signUpUser);
            const result = await authenticationService.signUp(user);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(true);
            expect(result.message).toBe('Successfully signed up. Waiting for Response.');
            const addedUsers = await Users.findOne({ username: user.username });
            expect(addedUsers).not.toBe(undefined);
            user.username = 'otheruser';
            const retryResult = await authenticationService.signUp(user);
            expect(retryResult).not.toBe(undefined);
            expect(retryResult.ok).toBe(false);
            expect(retryResult.message).toBe('E-mail already taken');
        });

        test('should not sign up with empty username', async () => {
            const user = cloneDeep(signUpUser);
            delete user.username;
            const result = await authenticationService.signUp(user);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Username cannot be empty');
        });

        test('should not sign up empty password', async () => {
            const user = cloneDeep(signUpUser);
            delete user.password;
            const result = await authenticationService.signUp(user);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('Password cannot be empty');
        });

        test('should not sign up empty e-mail', async () => {
            const user = cloneDeep(signUpUser);
            delete user.email;
            const result = await authenticationService.signUp(user);
            expect(result).not.toBe(undefined);
            expect(result.ok).toBe(false);
            expect(result.message).toBe('E-mail cannot be empty');
        });

    });

    afterAll(async (done) => {
        await dbm.disconnect();
        await mongod.stop();
        done();
    });
});
