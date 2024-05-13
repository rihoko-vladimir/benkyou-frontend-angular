import { Component } from '@angular/core';
import { ThemePreference } from '../../../../Models/Enums/ThemePreference';
import { ThemeService } from '../../../../Services/theme.service';

@Component({
  selector: 'theme-change',
  templateUrl: 'theme-change.component.html',
  styleUrl: 'theme-change.component.less'
})
export class ThemeChangeComponent {
  themePreference?: ThemePreference;
  protected readonly ThemePreference = ThemePreference;

  constructor(private themeService: ThemeService) {
    this.themeService.getTheme().subscribe(theme => {
      this.themePreference = theme;
    });
  }

  changeTheme() {
    switch (this.themePreference) {
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

  getTooltip() {
    switch (this.themePreference) {
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
  }
}
