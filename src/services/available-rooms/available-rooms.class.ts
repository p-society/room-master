import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { BadRequest } from '@feathersjs/errors';

interface Data {}

interface ServiceOptions {}

export class AvailableRooms implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    /*
     * @description
     * This Endpoint returns all the available rooms (status == Available ) between a startDate &
     * endDate. The Handler queries (agg.) the db to search for rooms between startDate and endDate and
     * sends the result to client as response.
     * */

    interface QueryInterface {
      startDate?: Date;
      endDate?: Date;
    }

    const { startDate, endDate } = params?.query as QueryInterface;

    if (!startDate || !endDate)
      throw new BadRequest('Please provide startDate and endDate');

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequest('Invalid date format');
    }

    const roomsModel = this.app.service('rooms').Model;

    // rooms that are not booked during the specified dates
    const roomsWithOrWithoutBookings = await roomsModel
      .aggregate([
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'room',
            as: 'bookings',
          },
        },
        {
          $match: {
            $or: [
              { bookings: { $size: 0 } },
              {
                bookings: {
                  $not: {
                    $elemMatch: {
                      dates: {
                        $not: {
                          $elemMatch: {
                            $lt: end,
                            $gte: start,
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ])
      .exec();

    const resp = roomsWithOrWithoutBookings.map((room: any) => {
      if (room.bookings.length === 0) {
        delete room.bookings;
        return room;
      }
    });

    return resp;
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
