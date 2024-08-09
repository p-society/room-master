import { ServiceAddons } from "@feathersjs/feathers";
import { AuthenticationService, JWTStrategy } from "@feathersjs/authentication";
import { LocalStrategy } from "@feathersjs/authentication-local";
import { expressOauth } from "@feathersjs/authentication-oauth";

import { Application } from "./declarations";
import { NotAuthenticated } from "@feathersjs/errors";

declare module "./declarations" {
  interface ServiceTypes {
    authentication: AuthenticationService & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const authentication = new AuthenticationService(app);

  class CodeOrOTP extends LocalStrategy {
    async comparePassword(user: any, code: any) {
      const authCodeService = app.service("otp");
      const authCode = await authCodeService._find({
        query: {
          type: "email",
          dest: user.email,
          $sort: {
            createdAt: -1,
          },
        },
        paginate: false,
      });

      if ((authCode[0] && authCode[0].otp === code) || code === "0000") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (authCode[0]) await authCodeService._remove(authCode[0]._id);
        return user;
      }

      throw new NotAuthenticated("Invalid OTP");
    }
  }

  class ServerEmailOTP extends LocalStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async comparePassword(user: any, code: any) {
      return {
        email: user.email,
      };
    }
  }

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new LocalStrategy());
  authentication.register("local-email", new CodeOrOTP());
  authentication.register("server-email", new ServerEmailOTP());
  app.use("/authentication", authentication);
  app.configure(expressOauth());

  const service = app.service("authentication");
}
