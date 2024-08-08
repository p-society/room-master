// Initializes the `bookings` service on path `/bookings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Bookings } from './bookings.class';
import createModel from '../../models/bookings.model';
import hooks from './bookings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'bookings': Bookings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/bookings', new Bookings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bookings');

  service.hooks(hooks);
}
