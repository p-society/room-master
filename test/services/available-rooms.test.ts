import app from '../../src/app';

describe('\'available-rooms\' service', () => {
  it('registered the service', () => {
    const service = app.service('available-rooms');
    expect(service).toBeTruthy();
  });
});
