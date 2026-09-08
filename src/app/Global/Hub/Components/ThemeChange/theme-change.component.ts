import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemePreference } from '../../../../Models/Enums/ThemePreference';
import { ThemeService } from '../../../../Services/theme.service';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-theme-change',
  templateUrl: 'theme-change.component.html',
  styleUrl: 'theme-change.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatTooltip, MatIcon]
})
export class ThemeChangeComponent {
  private themeService = inject(ThemeService);

  // Zoneless prep (commit A): the theme stream is now a signal; template
  // and logic read `themePreference()` so zoneless schedules CD on change.
  themePreference = toSignal(this.themeService.getTheme());
  protected readonly ThemePreference = ThemePreference;

  changeTheme() {
    switch (this.themePreference()) {
      case ThemePreference.Auto: {
        this.themeService.setTheme(ThemePreference.Light);
        break;
      }
      case ThemePreference.Dark: {
        this.themeService.setTheme(ThemePreference.Auto);
        break;
      }
      case ThemePreference.Light: {
        this.themeService.setTheme(ThemePreference.Dark);
        break;
      }
    }
  }

  tooltip = computed(() => {
    switch (this.themePreference()) {
      case ThemePreference.Auto: {
        return 'Switch to Light Theme';
      }
      case ThemePreference.Dark: {
        return 'Switch to System Theme';
      }
      case ThemePreference.Light: {
        return 'Switch to Dark Theme';
      }
    }

    return '';
  });
}
