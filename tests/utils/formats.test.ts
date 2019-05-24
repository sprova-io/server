import { formatInsertOne } from '../../src/utils/formats';

import { insertOneNegativeResponse1, insertOneResponse1 } from "../fixtures/formats.fixture";

describe('Formats', () => {
    describe('formatInsertOne()', () => {
        test('should format correct object', () => {
            const result = formatInsertOne(insertOneResponse1);
            expect(result.ok).toBe(true);
            expect(result._id).toBe(insertOneResponse1.insertedId);
        });

        test('should format negative result', () => {
            const result = formatInsertOne(insertOneNegativeResponse1);
            expect(result.ok).toBe(false);
        });
    });
});
