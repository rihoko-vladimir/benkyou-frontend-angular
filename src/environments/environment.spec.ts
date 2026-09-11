import { environment } from './environment';
import { environment as productionEnvironment } from './environment.prod';

describe('environment', () => {
  it('disables production mode in the default environment', () => {
    expect(environment.production).toBe(false);
  });

  it('enables production mode in the production environment', () => {
    expect(productionEnvironment.production).toBe(true);
  });
});
