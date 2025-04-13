import * as config from '../src/config';

describe('Config Index', () => {
  it('should export the configuration functions', () => {
    expect(config.appConfig).toBeInstanceOf(Function);
    expect(config.databaseConfig).toBeInstanceOf(Function);
  });
});