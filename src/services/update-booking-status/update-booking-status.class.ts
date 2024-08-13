import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { BadRequest, NotAuthenticated } from "@feathersjs/errors";
import RolesEnum from "../../constants/roles.enum";
import BookingStatus from "../../constants/booking-status.enum";

interface Data {}
interface CreateDTO {
  user: Id;
  status?:
    | BookingStatus.APPROVED
    | BookingStatus.CANCELLED
    | BookingStatus.PENDING;
  paid?: true | false;
}
interface ServiceOptions {}

export class UpdateBookingStatus implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: CreateDTO, params?: Params): Promise<Data> {
    if (!params || !params.user) throw new NotAuthenticated();
    if (![RolesEnum.SUPER_ADMIN].includes(params.user.type))
      throw new BadRequest(
        "Only Super Admins are allowed to perform this task."
      );

    if (!id) {
      throw new BadRequest("Please provide the Booking ID to be updated.");
    }

    const reqBody: Record<string, any> = {};
    if (data.paid) reqBody["paid"] = data.paid;
    if (data.status) reqBody["status"] = data.status;

    const resp = await this.app.service("bookings")._patch(id, reqBody);
    return resp;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
