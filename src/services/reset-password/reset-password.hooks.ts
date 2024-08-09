import { HooksObject } from '@feathersjs/feathers';
import findAndResetPass from './hook/find-and-reset-pass';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [findAndResetPass()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
