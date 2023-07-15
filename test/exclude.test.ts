import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { $enum, $exclude, InferValue } from '../src';

describe('$exclude', () => {
  test('TSD static type checks', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });

  describe('basic enum', () => {
    const STATUS = $enum(['pending', 'fulfilled', 'rejected']);
    const SETTLED_STATUS = $exclude(STATUS, ['pending']);
    type SettledStatus = InferValue<typeof SETTLED_STATUS>;

    test('values', () => {
      expect(SETTLED_STATUS.values()).toEqual<SettledStatus[]>([
        'fulfilled',
        'rejected',
      ]);
    });

    test('isValue', () => {
      expect(SETTLED_STATUS.isValue('pending')).toBe(false);
      expect(SETTLED_STATUS.isValue('rejected')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => SETTLED_STATUS.assertValue('pending')).toThrowError(
        'Enum value out of range (received "pending", expected one of: "fulfilled", "rejected")'
      );
      expect(() => SETTLED_STATUS.assertValue('rejected')).not.toThrowError();
    });
  });

  describe('labeled enum - remove by key', () => {
    const LEVEL = $enum({ off: 0, warn: 1, error: 2 });
    const ERROR_LEVEL = $exclude(LEVEL, ['off']);
    type ErrorLevel = InferValue<typeof ERROR_LEVEL>;

    test('values', () => {
      expect(ERROR_LEVEL.values()).toEqual([1, 2]);
    });

    test('isValue', () => {
      expect(ERROR_LEVEL.isValue(0)).toBe(false);
      expect(ERROR_LEVEL.isValue(1)).toBe(true);
    });

    test('keys', () => {
      expect(ERROR_LEVEL.keys()).toEqual(['warn', 'error']);
    });

    test('isKey', () => {
      expect(ERROR_LEVEL.isKey('off')).toBe(false);
      expect(ERROR_LEVEL.isKey('error')).toBe(true);
    });

    test('entries', () => {
      expect(ERROR_LEVEL.entries()).toEqual([
        ['warn', 1],
        ['error', 2],
      ]);
    });

    test('object', () => {
      expect(ERROR_LEVEL.object).toEqual<(typeof ERROR_LEVEL)['object']>({
        warn: 1,
        error: 2,
      });
    });

    test('keyOf', () => {
      expect(ERROR_LEVEL.keyOf(1)).toBe('warn');
    });
  });
});
