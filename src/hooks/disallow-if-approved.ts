// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { BadRequest, NotAuthenticated } from "@feathersjs/errors";
import { Hook, HookContext } from "@feathersjs/feathers";
import BookingStatus from "../constants/booking-status.enum";
import RolesEnum from "../constants/roles.enum";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    /**
     * hook to prevent user to update booking if booking is approved / cancelled.
     */
    const {
      app,
      params: { user },
      id,
    } = context;

    if (!user) throw new NotAuthenticated();
    if (!id) throw new BadRequest();

    if (user.type === RolesEnum.SUPER_ADMIN) return context;

    try {
      const booking = await app.service("bookings")._get(id);

      if (!booking) throw new BadRequest("Booking does not exist!");

      if (
        [BookingStatus.APPROVED, BookingStatus.CANCELLED].includes(
          booking.status
        )
      ) {
        throw new BadRequest(
          `Can\'t update the booking details,as it has already been ${booking.status}`
        );
      }
      return context;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };
};
