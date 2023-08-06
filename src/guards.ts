import type { EnumPrimitive, EnumSourceObject } from './types';

export function createValueGuards<T extends EnumPrimitive>(values: T[]) {
  return createGuards('Value', values);
}

export function createKeyGuards<T extends EnumPrimitive>(keys: T[]) {
  return createGuards('Key', keys);
}

export function createEntryGuards<T extends EnumSourceObject>(
  obj: T,
  objInverted: EnumSourceObject
) {
  return createGuards<[keyof T, T[keyof T]], 'Entry'>('Entry', entry => {
    if (!Array.isArray(entry) || entry.length !== 2) {
      return 'Enum entry must be a tuple (e.g. ["key", "value"])';
    }
    if (!(entry[0] in obj)) {
      return `Enum key out of range (received ${JSON.stringify(
        entry[0]
      )}, expected one of: ${Object.keys(obj)
        .map(key => JSON.stringify(key))
        .join(', ')})`;
    }
    if (obj[entry[0]] !== entry[1]) {
      return `Enum key and value don't match (expected [${JSON.stringify(
        entry[0]
      )}, ${JSON.stringify(obj[entry[0]])}] or [${JSON.stringify(
        objInverted[entry[1]]
      )}, ${JSON.stringify(entry[1])}])`;
    }
    return true;
  });
}

function createGuards<TItem, TKind extends 'Key' | 'Value' | 'Entry'>(
  kind: TKind,
  valuesOrPredicate: TItem[] | ((val: unknown) => true | string)
): { [K in `has${TKind}`]: (val: unknown) => val is TItem } & {
  [K in `assert${TKind}`]: (val: unknown) => asserts val is TItem;
} {
  const isFn = (value: unknown): boolean => {
    if (typeof valuesOrPredicate === 'function') {
      return valuesOrPredicate(value) === true;
    }
    return valuesOrPredicate.includes(value as TItem);
  };

  const assertFn = (value: unknown): void => {
    if (typeof valuesOrPredicate === 'function') {
      const res = valuesOrPredicate(value);
      if (typeof res === 'string') {
        throw new RangeError(res);
      }
    } else {
      if (!valuesOrPredicate.includes(value as TItem)) {
        throw new RangeError(
          `Enum ${kind.toLowerCase()} out of range (received ${JSON.stringify(
            value
          )}, expected one of: ${valuesOrPredicate
            .map(item => JSON.stringify(item))
            .join(', ')})`
        );
      }
    }
  };

  return {
    [`has${kind}`]: isFn,
    [`assert${kind}`]: assertFn,
  } as any;
}
