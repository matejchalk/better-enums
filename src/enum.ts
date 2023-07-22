import { create } from './create';
import { exclude } from './exclude';
import { extend } from './extend';
import type { IEnum } from './types';

export const Enum: IEnum = Object.assign(create, { extend, exclude });
