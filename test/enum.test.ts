import { $enum, ValueOf } from '../src';

describe('$enum', () => {
  describe('basic enum', () => {
    const ROLE = $enum(['viewer', 'editor', 'owner']);
    type Role = ValueOf<typeof ROLE>;

    test('values', () => {
      expect(ROLE.values()).toEqual<Role[]>(['viewer', 'editor', 'owner']);
    });

    test('isValue', () => {
      expect(ROLE.isValue('editor')).toBe(true);
      expect(ROLE.isValue('admin')).toBe(false);
      expect(ROLE.isValue(null)).toBe(false);
    });

    test('assertValue', () => {
      expect(() => ROLE.assertValue('owner')).not.toThrow();
      expect(() => ROLE.assertValue(0)).toThrowError(
        'Enum value out of range (received 0, expected one of: "viewer", "editor", "owner")'
      );
    });
  });

  describe('labeled enum', () => {
    const BOOKING_STATUS = $enum({
      missingConfirmation: 'chybí potvrzení',
      awaitingPayment: 'čeká se na platbu',
      complete: 'zaplaceno',
    });
    type BookingStatus = ValueOf<typeof BOOKING_STATUS>;

    test('values', () => {
      expect(BOOKING_STATUS.values()).toEqual<BookingStatus[]>([
        'chybí potvrzení',
        'čeká se na platbu',
        'zaplaceno',
      ]);
    });

    test('isValue', () => {
      expect(BOOKING_STATUS.isValue('zaplaceno')).toBe(true);
    });

    test('assertValue', () => {
      expect(() => BOOKING_STATUS.assertValue('zaplaceno')).not.toThrowError();
    });

    test('keys', () => {
      expect(BOOKING_STATUS.keys()).toEqual<
        ReturnType<(typeof BOOKING_STATUS)['keys']>
      >(['missingConfirmation', 'awaitingPayment', 'complete']);
    });

    test('isKey', () => {
      expect(BOOKING_STATUS.isKey('awaitingPayment')).toBe(true);
      expect(BOOKING_STATUS.isKey('zaplaceno')).toBe(false);
    });

    test('assertKey', () => {
      expect(() => BOOKING_STATUS.assertKey('complete')).not.toThrowError();
      expect(() => BOOKING_STATUS.assertKey(undefined)).toThrowError(
        `Enum key out of range (received undefined, expected one of: "missingConfirmation", "awaitingPayment", "complete")`
      );
    });

    test('entries', () => {
      expect(BOOKING_STATUS.entries()).toEqual<
        ReturnType<(typeof BOOKING_STATUS)['entries']>
      >([
        ['missingConfirmation', 'chybí potvrzení'],
        ['awaitingPayment', 'čeká se na platbu'],
        ['complete', 'zaplaceno'],
      ]);
    });

    test('isEntry', () => {
      expect(BOOKING_STATUS.isEntry(['awaitingPayment', 'zaplaceno'])).toBe(
        false
      );
      expect(BOOKING_STATUS.isEntry(['complete', 'zaplaceno'])).toBe(true);
    });

    test('assertEntry', () => {
      expect(() =>
        BOOKING_STATUS.assertEntry(['missingConfirmation', 'chybí potvrzení'])
      ).not.toThrowError();
      expect(() =>
        BOOKING_STATUS.assertEntry(['paid', 'zaplaceno'])
      ).toThrowError(
        'Enum key out of range (received "paid", expected one of: "missingConfirmation", "awaitingPayment", "complete")'
      );
      expect(() =>
        BOOKING_STATUS.assertEntry(['awaitingPayment', 'zaplaceno'])
      ).toThrowError(
        'Enum key and value don\'t match (expected ["awaitingPayment", "čeká se na platbu"] or ["complete", "zaplaceno"])'
      );
      expect(() => BOOKING_STATUS.assertEntry(['complete'])).toThrowError(
        'Enum entry must be a tuple (e.g. ["key", "value"])'
      );
    });

    test('obj', () => {
      expect(BOOKING_STATUS.obj).toEqual({
        missingConfirmation: 'chybí potvrzení',
        awaitingPayment: 'čeká se na platbu',
        complete: 'zaplaceno',
      });
    });

    test('keyOf', () => {
      expect(BOOKING_STATUS.keyOf('chybí potvrzení')).toBe(
        'missingConfirmation'
      );
      expect(BOOKING_STATUS.keyOf('zaplaceno')).toBe('complete');
    });
  });

  describe('from TypeScript string enum', () => {
    enum Action {
      Allow = 'allow',
      Block = 'block',
    }
    const ACTION = $enum(Action);

    test('values', () => {
      expect(ACTION.values()).toEqual<ValueOf<typeof ACTION>[]>([
        'allow',
        'block',
      ]);
    });

    test('isValue', () => {
      expect(ACTION.isValue(Action.Block)).toBe(true);
      expect(ACTION.isValue('block')).toBe(true);
      expect(ACTION.isValue('Block')).toBe(false);
    });

    test('keys', () => {
      expect(ACTION.keys()).toEqual<(keyof typeof Action)[]>([
        'Allow',
        'Block',
      ]);
    });

    test('isKey', () => {
      expect(ACTION.isKey('Allow')).toBe(true);
      expect(ACTION.isKey('allow')).toBe(false);
    });

    test('entries', () => {
      expect(ACTION.entries()).toEqual<[keyof typeof Action, `${Action}`][]>([
        ['Allow', 'allow'],
        ['Block', 'block'],
      ]);
    });

    test('obj', () => {
      expect(ACTION.obj).toEqual({
        Allow: 'allow',
        Block: 'block',
      });
    });

    test('keyOf', () => {
      expect(ACTION.keyOf(Action.Allow)).toEqual('Allow');
      expect(ACTION.keyOf('block')).toEqual('Block');
    });
  });

  describe('from TypeScript number enum', () => {
    enum Level {
      off,
      warn,
      error,
    }
    const LEVEL = $enum(Level);

    test('values', () => {
      expect(LEVEL.values()).toEqual<Level[]>([0, 1, 2]);
    });

    test('isValue', () => {
      expect(LEVEL.isValue(Level.warn)).toBe(true);
      expect(LEVEL.isValue('warn')).toBe(false);
      expect(LEVEL.isValue(1)).toBe(true);
      expect(LEVEL.isValue(3)).toBe(false);
    });

    test('keys', () => {
      expect(LEVEL.keys()).toEqual<(keyof typeof Level)[]>([
        'off',
        'warn',
        'error',
      ]);
    });

    test('keyOf', () => {
      expect(LEVEL.keyOf(2)).toEqual('error');
      expect(LEVEL.keyOf(Level.warn)).toEqual('warn');
    });
  });
});
