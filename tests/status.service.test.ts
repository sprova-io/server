import { status } from '../src/services/status.service';

test('status() Should return serverstatus', () => {
    const result = status();
    expect(result).not.toBe(undefined);
    expect(result.running).toBe(true);
})
