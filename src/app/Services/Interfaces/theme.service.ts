import { ThemePreference } from '../../Models/Enums/ThemePreference';
import { Observable } from 'rxjs';

export interface IThemeService {
  getTheme(): Observable<ThemePreference | undefined>;

  setTheme(theme: ThemePreference): void;
}
