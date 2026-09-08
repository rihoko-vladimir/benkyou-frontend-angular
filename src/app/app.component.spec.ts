import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { ThemePreference } from './Models/Enums/ThemePreference';
import { ThemeService } from './Services/theme.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      // AppComponent is a standalone component (post-migration), so it goes
      // into `imports`, not `declarations`. The template renders
      // <router-outlet name="primary">, whose real directive needs a live
      // Router - provideRouter([]) supplies one without any routes.
      // NOTE: do NOT stub ApplicationRef here — Angular 18's
      // ChangeDetectionSchedulerImpl injects the real one and the bare
      // { tick } useValue stub breaks its constructor.
      providers: [provideRouter([]), { provide: ThemeService, useValue: { getTheme: () => of(ThemePreference.Light) } }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('applies the theme class matching the theme preference', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(document.body.classList.contains('light-theme')).toBe(true);
  });
});
