import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import { ThemeService } from './theme.service';
import { ThemePreference } from '../Models/Enums/ThemePreference';
import { selectAccount } from '../Redux/Selectors/selectors';
import { themeChange } from '../Redux/Actions/account.actions';

describe('ThemeService', () => {
  let service: ThemeService;
  let storeStub: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    storeStub = {
      select: vi.fn(() => of({ themePreference: ThemePreference.Dark })),
      dispatch: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: Store, useValue: storeStub }]
    });

    service = TestBed.inject(ThemeService);
  });

  it('getTheme selects the account slice and resolves the themePreference', async () => {
    const result = await firstValueFrom(service.getTheme());

    expect(storeStub.select).toHaveBeenCalledWith(selectAccount);
    expect(result).toBe(ThemePreference.Dark);
  });

  it('setTheme dispatches themeChange with the given theme', () => {
    service.setTheme(ThemePreference.Light);

    expect(storeStub.dispatch).toHaveBeenCalledWith(themeChange({ theme: ThemePreference.Light }));
  });
});
