import { Id, NullableId, Params, ServiceMethods } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { BadRequest, NotAuthenticated } from "@feathersjs/errors";
import BookingStatus from "../../constants/booking-status.enum";

interface Data {}

interface ServiceOptions {}

export class BookingCount implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }
  async find(params?: Params): Promise<any> {
    if (!params?.user) throw new NotAuthenticated();

    const { query } = params;

    if (!query || !query.month)
      throw new BadRequest("Please provide month to check for bookings.");

    const month = parseInt(query.month, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      throw new BadRequest(
        "Invalid month. It should be a number between 1 and 12."
      );
    }

    const year = new Date().getFullYear();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    // @ts-ignore
    const bookings = await this.app.service("bookings").Model.aggregate([
      {
        $match: {
          deleted: { $ne: true },
          dates: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$dates",
      },
      {
        $match: {
          dates: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$dates" },
          status: 1,
        },
      },
      {
        $group: {
          _id: { day: "$day", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.day",
          counts: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          counts: {
            $arrayToObject: {
              $map: {
                input: "$counts",
                as: "item",
                in: {
                  k: "$$item.status",
                  v: "$$item.count",
                },
              },
            },
          },
        },
      },
      {
        $sort: { day: 1 },
      },
    ]);

    const result = [];
    for (let day = 1; day <= endDate.getDate(); day++) {
      const dayData = bookings.find((d: any) => d.day === day) || {
        day,
        counts: {},
      };
      result.push({
        day: dayData.day,
        approved: dayData.counts[BookingStatus.APPROVED] || 0,
        pending: dayData.counts[BookingStatus.PENDING] || 0,
        cancelled: dayData.counts[BookingStatus.CANCELLED] || 0,
      });
    }

    return result;
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
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
