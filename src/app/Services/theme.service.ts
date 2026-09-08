import { IThemeService } from './Interfaces/theme.service';
import { ThemePreference } from '../Models/Enums/ThemePreference';
import { switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import { selectAccount } from '../Redux/Selectors/selectors';
import { themeChange } from '../Redux/Actions/account.actions';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class ThemeService implements IThemeService {
  private store = inject<Store<AppState>>(Store);

  getTheme() {
    return this.store
      .select(selectAccount)
      .pipe(switchMap(async state => state.themePreference as ThemePreference | undefined));
  }

  setTheme(theme: ThemePreference) {
    this.store.dispatch(themeChange({ theme }));
  }
}
