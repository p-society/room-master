// Initializes the `available-rooms` service on path `/available-rooms`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AvailableRooms } from './available-rooms.class';
import hooks from './available-rooms.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'available-rooms': AvailableRooms & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/available-rooms', new AvailableRooms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('available-rooms');

  service.hooks(hooks);
}
