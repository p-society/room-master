import app from '../../src/app';

describe('\'bookings\' service', () => {
  it('registered the service', () => {
    const service = app.service('bookings');
    expect(service).toBeTruthy();
  });
});
