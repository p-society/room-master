import { Hook } from "@feathersjs/feathers";
import { replaceItems } from "feathers-hooks-common";

const removeOTP = (): Hook => async (context) => {
  try {
    const { app, result } = context;
    console.log("here 1");
    const authService = app.service("authentication");

    const response = await authService.create({
      strategy: "server-email",
      email: result.email,
      code: "0000",
    });
    console.log({ response });
    const authCodeService = app.service("otp");
    const authCode = await authCodeService._find({
      query: {
        type: "email",
        dest: result.email,
        $sort: {
          createdAt: -1,
        },
      },
      paginate: false,
    });

    console.log({ authCode });

    await Promise.all(
      authCode.map((each: { _id: any }) => authCodeService._remove(each._id))
    );

    replaceItems(context, response);

    context.dispatch = response;

    return context;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default removeOTP;
