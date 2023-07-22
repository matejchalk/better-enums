import { create } from './create';
import { exclude } from './exclude';
import { extend } from './extend';
import type { BetterEnum } from './types';

export const Enum: BetterEnum = Object.assign(create, { extend, exclude });
