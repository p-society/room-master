import { Application } from '../declarations';
import users from './users/users.service';
import bookings from './bookings/bookings.service';
import rooms from './rooms/rooms.service';
import bookingCount from './booking-count/booking-count.service';
import resetPassword from './reset-password/reset-password.service';
import forgotPassword from './forgot-password/forgot-password.service';
import sendOtp from './send-otp/send-otp.service';
import otp from './otp/otp.service';
import updateBookingStatus from './update-booking-status/update-booking-status.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(bookings);
  app.configure(rooms);
  app.configure(bookingCount);
  app.configure(resetPassword);
  app.configure(forgotPassword);
  app.configure(otp);
  app.configure(sendOtp);
  app.configure(updateBookingStatus);
}
