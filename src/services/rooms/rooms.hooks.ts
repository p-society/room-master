import * as authentication from '@feathersjs/authentication';
import setCreatedBy from '../../hooks/setCreatedBy';
import handleSoftDelete from '../../hooks/handleSoftDelete';
import RoleGuard from '../../hooks/roleGuard';
import RolesEnum from '../../constants/roles.enum';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [handleSoftDelete()],
    get: [handleSoftDelete()],
    create: [RoleGuard(RolesEnum.SUPER_ADMIN), setCreatedBy()],
    update: [],
    patch: [RoleGuard(RolesEnum.SUPER_ADMIN), handleSoftDelete()],
    remove: [RoleGuard(RolesEnum.SUPER_ADMIN), handleSoftDelete()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
