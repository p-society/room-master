import { BadRequest } from "@feathersjs/errors";
import { Application } from "@feathersjs/express";
import { Request, Response } from "express";
import Mailer from "../../mailer";
import forgotPassword from "../../templates/forgot-password/index";

const EXPIRATION_OFFSET: number = 10; // 10 Minutes
export default function (app: Application): void {
  app.use("/forgot-password", async function (req: Request, res: Response) {
    try {
      const { email } = req.body;
      /**
       * @zakhaev26
       *@todo improve locales by adding more local languages if needed.
       */
      //   const { lang } = req.query;

      if (!email) throw new BadRequest("Email not provided");

      const user = await app.service("users")._find({
        query: {
          email: email,
          $limit: 1,
        },
        paginate: false,
      });

      if (user.length === 0) throw new Error("No user found");
      // user exists,so create OTP

      const today = new Date();
      today.setMinutes(today.getMinutes() + EXPIRATION_OFFSET);
      const expirationDate = new Date(today);

      const OTP = generateOTP();

      await app.service("reset-password")._create({
        user: user[0]._id,
        otp: OTP,
        email: email,
        expiresAt: expirationDate,
      });

      const tmpl: string = forgotPassword["en"].render({
        username: user[0].username,
        otp: OTP,
        expiration: EXPIRATION_OFFSET, //template has minutes
      });
      await new Mailer().sendPasswordResetOTP(
        [email],
        "Reset Your Password",
        tmpl
      );
      res.json({
        message: "OTP sent successfully on E-mail Id",
      });
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  });
}

function generateOTP() {
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    OTP += digits[randomIndex];
  }

  return OTP;
}
