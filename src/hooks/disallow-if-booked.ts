import { BadRequest, NotAuthenticated } from "@feathersjs/errors";
import { Hook, HookContext } from "@feathersjs/feathers";
import BookingStatus from "../constants/booking-status.enum";

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
        "Please provide room and dates to create the booking."
      );

    let { dates } = data;
    const { room } = data;
    if (!Array.isArray(dates) || dates.length !== 2) {
      throw new BadRequest(
        "Please provide a valid date range with start and end dates."
      );
    }
    const [startDate, endDate] = dates.map(
      (date: string | Date) => new Date(date)
    );

    try {
      const existingBookings = await app.service("bookings").Model.find({
        room,
        dates: {
          $elemMatch: {
            $lte: endDate,
            $gte: startDate,
          },
        },
        status: { $ne: BookingStatus.CANCELLED },
        deleted: { $ne: true },
      });

      console.log(existingBookings);
      if (existingBookings.length > 0) {
        throw new BadRequest(
          "This room is already booked for the specified dates."
        );
      }

      return context;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };
};
