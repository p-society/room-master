// Initializes the `update-booking-status` service on path `/update-booking-status`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { UpdateBookingStatus } from './update-booking-status.class';
import hooks from './update-booking-status.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'update-booking-status': UpdateBookingStatus & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/update-booking-status', new UpdateBookingStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('update-booking-status');

  service.hooks(hooks);
}
