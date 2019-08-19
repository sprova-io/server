import db from '../../src/utils/db';

describe('database', () => {
    describe('no db', () => {
        test('get connectUrl', () => {
            expect(db.connectUrl).toEqual('mongodb://localhost:27027/sprova');
        });

        test('get mongoOptions', () => {
            expect(db.mongoOptions).toStrictEqual(
                {
                    reconnectTries: 60,
                    reconnectInterval: 1000,
                    autoReconnect: true,
                    useNewUrlParser: true
                }
            );
        });

        test('connect()', async () => {
            await expect(db.connect()).rejects
                .toThrowError('Could not establish database connection after retrying -1 times');
        });

        test('disconnect()', async () => {
            await expect(db.disconnect()).rejects
                .toThrowError('Attempting to close a DB connection which does not exist.');
        });

        test('getCollection()', async () => {
            const name = 'projects';
            await expect(db.getCollection(name)).rejects
                .toThrowError(`Trying to open collection ${name} without database connection!`);
        });

    });
});
