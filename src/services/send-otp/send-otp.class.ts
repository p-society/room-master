import { Params, ServiceMethods } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import OTPTempl from "../../templates/otp/index";
import Mailer from "../../mailer";
// import axios from 'axios';
// import {PublishCommand, SNSClient} from '@aws-sdk/client-sns';

interface Data {
  phone: string;
  hash?: string;
  email: string;
}

interface ServiceOptions {}

function generateOTP() {
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    OTP += digits[randomIndex];
  }

  return OTP;
}

// Configure the AWS region
// const region = 'ap-south-1';

// Create an instance of the SNS client
// const snsClient = new SNSClient({ region, credentials: {
//   secretAccessKey: '',
//   accessKeyId: '',
// } });

export class SendOtp implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async find (params?: Params): Promise<Data[] | Paginated<Data>> {
  //   return [];
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async get (id: Id, params?: Params): Promise<Data> {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  async create(
    data: Data,
    _params?: Params
  ): Promise<{ message: string; isNewUser: boolean }> {
    const otpService = this.app.service("otp");
    const userService = this.app.service("users");

    const otp = generateOTP();

    await otpService._create({
      type: "email",
      dest: data.email,
      otp,
    });

    const [user] = await userService._find({
      query: {
        email: data.email,
      },
      paginate: false,
    });

    const EXPIRATION_OFFSET: number = 10; // 10 Minutes

    const tmpl: string = OTPTempl["en"].render({
      firstName: data.email,
      otp,
      expiration: EXPIRATION_OFFSET, //template has minutes
    });

    await new Mailer().send(
      [data.email],
      "OTP Verfication for IIIT-Bh Room Master",
      tmpl
    );

    return {
      message: "OTP Send Successfully",
      isNewUser: !Boolean(user),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
  //   return data;
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
  //   return data;
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async remove (id: NullableId, params?: Params): Promise<Data> {
  //   return { id };
  // }
}
