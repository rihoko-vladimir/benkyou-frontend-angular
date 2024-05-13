import { ApplicationRef, Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { ThemePreference } from './Models/Enums/ThemePreference';
import { ThemeService } from './Services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private contexts: ChildrenOutletContexts,
    private ref: ApplicationRef,
    private themeService: ThemeService
  ) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        this.setTheme(ThemePreference.Dark);
      } else {
        this.setTheme(ThemePreference.Light);
      }
    });

    this.themeService.getTheme().subscribe(theme => {
      this.setTheme(theme!);
    });
  }

  getAppRoutingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  private setTheme(theme: ThemePreference) {
    switch (theme) {
      case ThemePreference.Light:
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        break;
      case ThemePreference.Dark:
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        break;
      case ThemePreference.Auto:
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
          break;
        }

        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        break;
    }

    this.ref.tick();
  }
}
