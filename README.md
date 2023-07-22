# better-enums

**Better enums for TypeScript.**

The `better-enums` library provides a simple utility for creating an improved version of TypeScript enums.

## Motivation

### Enums vs unions

Many in the TypeScript community consider using TypeScript's **built-in `enum` keyword a bad practice** (Anders Hejlsberg himself has stated he wouldn't have put them into the language in retrospect). The recommendation is to **use union types instead**, which may be inferred from arrays or objects when some runtime representation is also needed (e.g. for iteration). For more information on this topic, see:

- [Enums considered harmful](https://www.youtube.com/watch?v=jjMbPt_H3RQ) by Matt Pocock,
- [Let's Talk About TypeScript's Worst Feature](https://www.youtube.com/watch?v=Anu8vHXsavo) by Theo Browne,
- [Should You Use Enums or Union Types in Typescript?](https://www.bam.tech/en/article/should-you-use-enums-or-union-types-in-typescript) by Matthieu Gicquel.

### Best of both worlds

This library provides a custom enum implementation which attempts to **avoid the pitfalls of TS enums**, while also **enhancing unions with runtime features**.

These "better enums" are created either from an array of values (a "**basic enum**") or an object mapping keys to values (a "**labeled enum**"), with a union type then being automatically inferred from these values. This pattern is the commonly recommended alternative to the `enum` keyword. Using this library has the advantage of encapsulating some of the necessary TypeScript magic that can be daunting for less experienced TypeScript programmers.

The labeled enums offer good compatibilty with built-in enums. Since they support the same dot syntax and can even be created from an existing built-in enum, migrating away from the `enum` keyword should be fairly straightforward for existing projects.

The main advantages of using `better-enums` over built-in enums and/or unions are:

- 😌 **simplifies the recommended "inferred union" pattern**,
- ⛔ **no built-in enum weirdness** (e.g. no nominal typing, no mixed-in reverse mapping),
- 🛡️ provides **convenient type guards** for CFA-compatible runtime checks (i.e. automatic type narrowing),
- 📜 provides **array of all values** (labeled enums also provide **arrays of keys or key-value pairs**),
- 🏭 includes **helper functions for composing new enums from existing ones** (by extending values or excluding from them),
- 📈 can easily **convert built-in enums**,
- 🌑 support for **dot syntax (optional)**,
- 💙 **excellent type-safety** in general.

## Setup

Install the `better-enums` package using your favourite package manager:

```sh
npm install better-enums
```

```sh
yarn add better-enums
```

```sh
pnpm add better-enums
```

## Usage

### Creating enums

#### Basic enums

Import the `Enum` callable object to create a basic enum and infer its union type with the `InferValue` utility type:

```ts
import { Enum, type InferValue } from 'better-enums';

const ROLE = Enum(['viewer', 'editor', 'admin']);
type Role = InferValue<typeof ROLE>;
```

Then you can use the inferred types in your type definitions:

```ts
type User = {
  email: string;
  role: Role; // role is 'viewer' | 'editor' | 'admin'
};
```

The advantage of creating the enum object is that you may also use runtime features:

- list all values with `.values()`:

  ```ts
  ROLE.values().forEach(role => {
    console.log(role);
  });
  ```

- check value with `.hasValue(x)` (returns `true`/`false`):

  ```ts
  function f(value: string | undefined) {
    // value is string | undefined
    if (ROLE.hasValue(value)) {
      // value is Role
    }
  }
  ```

- check value with `.assertValue(x)` (throws `RangeError` if invalid):

  ```ts
  function f(value: string | undefined) {
    try {
      // value is string | undefined
      ROLE.assertValue(value);
      // value is Role
    } catch (err: unknown) {
      if (err instanceof RangeError) {
        // 'Enum value out of range (received undefined, expected one of: "user", "admin", "superadmin")'
        console.warn(err.message);
      }
    }
  }
  ```

#### Labeled enums

If you prefer to use something more similar to classic enums, you can provide an object instead of an array when calling `Enum`:

```ts
const ROLE = Enum({
  Viewer: 'viewer',
  Editor: 'editor',
  Admin: 'admin',
});
type Role = InferValue<typeof ROLE>;
const Role = ROLE.object;
```

Then you can access enum values either directly or via their key:

```ts
function createUser(email: string, role: Role) {}

// these are equivalent
createUser('john.doe@example.com', Role.Admin);
createUser('john.doe@example.com', 'admin');
```

Labeled enums support all the methods of basic enums (e.g. `.values()` or `.hasValue(x)`), as well as additional methods:

- list all keys with `.keys()`,
- check key with `.hasKey(x)` or `.assertKey(x)`,
- list all key-value pairs with `.entries()`,
- check key-value pair with `.hasEntry([x, y])` or `.assertEntry([x, y])`,
- get key for given value with `.keyOf(x)`.

### Composing enums

In addition to creating brand new enums, you can easily derive new enums from existing ones.

#### Adding values (`Enum.extend`)

To add values to a basic enum, pass in an array of values:

```ts
const ROLE = Enum(['viewer', 'editor', 'admin']);

const ENHANCED_ROLE = Enum.extend(ROLE, ['superadmin']);
// equivalent to: Enum(['viewer', 'editor', 'admin', 'superadmin'])
```

To add values to a labeled enum, pass in an object:

```ts
const ROLE = Enum({
  Viewer: 'viewer',
  Editor: 'editor',
  Admin: 'admin',
});

const ENHANCED_ROLE = Enum.extend(ROLE, {
  SuperAdmin: 'superadmin',
});
/* equivalent to:
const ENHANCED_ROLE = Enum({
  Viewer: 'viewer',
  Editor: 'editor',
  Admin: 'admin',
  SuperAdmin: 'superadmin',
});
*/
```

If you pass in an array of values for a labeled enum, the result will be a basic enum:

```ts
const ROLE = Enum({
  Viewer: 'viewer',
  Editor: 'editor',
  Admin: 'admin',
});

const ENHANCED_ROLE = Enum.extend(ROLE, ['superadmin']);
// equivalent to: Enum(['viewer', 'editor', 'admin', 'superadmin'])
```

#### Removing values (`Enum.exclude`)

To remove values from a basic enum, pass in an array of values:

```ts
const ROLE = Enum(['viewer', 'editor', 'admin']);

const RESTRICTED_ROLE = Enum.exclude(ROLE, ['admin']);
// equivalent to: Enum(['viewer', 'editor'])
```

To remove values from a labeled enum, you have two alternatives:

- pass in an array of keys:

  ```ts
  const ROLE = Enum({
    Viewer: 'viewer',
    Editor: 'editor',
    Admin: 'admin',
  });

  const RESTRICTED_ROLE = Enum.exclude(ROLE, ['Admin']);
  /* equivalent to:
  const RESTRICTED_ROLE = Enum({
    Viewer: 'viewer',
    Editor: 'editor',
  });
  */
  ```

- pass in an array of values:

  ```ts
  const ROLE = Enum({
    Viewer: 'viewer',
    Editor: 'editor',
    Admin: 'admin',
  });

  const RESTRICTED_ROLE = Enum.exclude(ROLE, ['admin']);
  /* equivalent to:
  const RESTRICTED_ROLE = Enum({
    Viewer: 'viewer',
    Editor: 'editor',
  });
  */
  ```

### Converting enums

If you're stuck with some built-in TypeScript `enum`s in your project (e.g. from some code generator), you can easily upgrade them to better enums. 🙂

#### Convert a built-in string `enum`

```ts
enum Role = {
  Viewer = 'viewer',
  Editor = 'editor',
  Admin = 'admin',
}

const ROLE = Enum(Role);
/* equivalent to:
const ROLE = Enum({
  Viewer: 'viewer',
  Editor: 'editor',
  Admin: 'admin',
});
*/
```

#### Convert a built-in number `enum`

```ts
enum Role = {
  Viewer,
  Editor,
  Admin,
}

const ROLE = Enum(Role);
/* equivalent to:
const ROLE = Enum({
  Viewer: 0,
  Editor: 1,
  Admin: 2,
});
*/
```

(For numeric enums, the `Enum` function takes care of excluding the reverse mapping in the underlying runtime representation TypeScript creates. E.g. `.keys()` will only include keys and `.values()` will include values, unlike if you called `Object.keys` or `Object.values` on the original `enum`.)

## Contributing

- install dependencies using `npm install`,
- run tests (written with Jest and TSD) using `npm test`,
- build library using `npm run build`,
- generate documentation (with TypeDoc) using `npm run docs`.
