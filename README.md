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
