import app from '../../src/app';

describe('\'update-booking-status\' service', () => {
  it('registered the service', () => {
    const service = app.service('update-booking-status');
    expect(service).toBeTruthy();
  });
});
