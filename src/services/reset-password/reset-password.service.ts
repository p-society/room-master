// Initializes the `reset-password` service on path `/reset-password`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ResetPassword } from './reset-password.class';
import createModel from '../../models/reset-password.model';
import hooks from './reset-password.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'reset-password': ResetPassword & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/reset-password', new ResetPassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('reset-password');

  service.hooks(hooks);
}
