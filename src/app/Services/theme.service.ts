import { IThemeService } from './Interfaces/theme.service';
import { ThemePreference } from '../Models/Enums/ThemePreference';
import { switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import { themeChange } from '../Redux/Actions/account.actions';
import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService implements IThemeService {
  constructor(private store: Store<AppState>) {}

  getTheme() {
    return this.store
      .select('account')
      .pipe(switchMap(async state => state.themePreference as ThemePreference | undefined));
  }

  setTheme(theme: ThemePreference) {
    this.store.dispatch(themeChange({ theme }));
  }
}
