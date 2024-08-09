import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { Hook, HookContext } from '@feathersjs/feathers';
import BookingStatus from '../constants/booking-status.enum';

export default (): Hook => {
  /**
   * @zakhaev26
   * @abstract
   *
   * hook context to check if the room is already booked for the requested dates.
   */
  return async (context: HookContext): Promise<HookContext> => {
    const {
      data,
      app,
      params: { user },
    } = context;

    if (!user) throw new NotAuthenticated();
    if (!data.room || !data.dates)
      throw new BadRequest(
        'Please provide room and dates to create the booking.'
      );

    let { dates } = data;
    const { room } = data;
    if (!Array.isArray(dates)) dates = [dates];
    try {
      const existingBookings = await app.service('bookings')._find({
        query: {
          room,
          dates: {
            $elemMatch: {
              $in: dates,
            },
          },
          status: { $ne: BookingStatus.CANCELLED },
          deleted: { $ne: true },
        },
        paginate: false,
      });

      if (existingBookings.length > 0) {
        throw new BadRequest(
          'This room is already booked for the specified dates.'
        );
      }

      return context;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };
};
