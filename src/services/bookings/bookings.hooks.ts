import { HooksObject } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
import handleSoftDelete from "../../hooks/handleSoftDelete";
import setCreatedBy from "../../hooks/setCreatedBy";
import { disallow, discard, iff, PredicateFn } from "feathers-hooks-common";
import disallowIfApproved from "../../hooks/disallow-if-approved";
import { HookContext } from "../../app";
import disallowIfBooked from "../../hooks/disallow-if-booked";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const isUserType = (context: HookContext): boolean => {
  const { user } = context.params;
  return user?.type === "user";
};

export default {
  before: {
    all: [authenticate("jwt")],
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
    create: [disallowIfBooked(), setCreatedBy("user")],
    update: [],
    patch: [
      disallowIfApproved(),
      handleSoftDelete(),
      // @ts-ignore
      iff(isUserType, discard("paid", "doneByAdmin", "status", "approvedBy")),
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
