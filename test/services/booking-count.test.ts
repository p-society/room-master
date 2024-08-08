import app from '../../src/app';

describe('\'booking-count\' service', () => {
  it('registered the service', () => {
    const service = app.service('booking-count');
    expect(service).toBeTruthy();
  });
});
