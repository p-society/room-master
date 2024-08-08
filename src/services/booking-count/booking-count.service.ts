// Initializes the `booking-count` service on path `/booking-count`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { BookingCount } from './booking-count.class';
import hooks from './booking-count.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'booking-count': BookingCount & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/booking-count', new BookingCount(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('booking-count');

  service.hooks(hooks);
}
