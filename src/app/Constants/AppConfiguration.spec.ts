import { TestBed } from '@angular/core/testing';
import { AppConfiguration } from './AppConfiguration';

describe('AppConfiguration', () => {
  it('defaults apiEndpoint to the local dev API', () => {
    const config = new AppConfiguration();

    expect(config.apiEndpoint).toBe('http://localhost:3080');
  });

  it('is provided at the root injector', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(AppConfiguration).apiEndpoint).toBe('http://localhost:3080');
  });
});
