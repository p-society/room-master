import { Hook, HookContext } from "@feathersjs/feathers";

const setQuery =
  (key: string, value: any): Hook =>
  (context: HookContext): HookContext => {
    console.log(context.params.user);
    if (typeof context.params.provider === "undefined") return context;

    if (!context.params.query) {
      context.params.query = {};
    }
    context.params.query[key] = context.params.user
      ? context.params.user[value]
      : undefined;
    console.log(context.params.query);
    return context;
  };

export default setQuery;
