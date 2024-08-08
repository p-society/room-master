import { Application } from '../declarations';
import users from './users/users.service';
import bookings from './bookings/bookings.service';
import rooms from './rooms/rooms.service';
import bookingCount from './booking-count/booking-count.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(bookings);
  app.configure(rooms);
  app.configure(bookingCount);
}
