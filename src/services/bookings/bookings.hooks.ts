import * as authentication from '@feathersjs/authentication';
import { discard, iff } from 'feathers-hooks-common';
import { HookContext } from '../../app';
import RolesEnum from '../../constants/roles.enum';
import disallowIfApproved from '../../hooks/disallow-if-approved';
import disallowIfBooked from '../../hooks/disallow-if-booked';
import handleSoftDelete from '../../hooks/handleSoftDelete';
import setCreatedBy from '../../hooks/setCreatedBy';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const isUserType = (context: HookContext): boolean => {
  const { user } = context.params;
  console.log(user?.type === 1);
  return user?.type === RolesEnum.USER;
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [handleSoftDelete()],
    get: [handleSoftDelete()],
    /**
     * @zakhaev26
     * @todo
     * There can be high profile guests whose bookking is to be done by
     * the officials.Hence a user account wont be available
     * so a generalized dummy user to be created and ported here,
     * can only be done via SUPER_ADMIN
     */
    create: [disallowIfBooked(), discard('status'), setCreatedBy()],
    update: [],
    patch: [
      disallowIfApproved(),
      handleSoftDelete(),
      // @ts-expect-error old defs in .d.ts lib files
      iff(isUserType, discard('paid', 'doneByAdmin', 'status', 'approvedBy')),
    ],
    remove: [handleSoftDelete()],
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
