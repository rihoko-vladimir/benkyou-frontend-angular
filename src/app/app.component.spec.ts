import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChildrenOutletContexts } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { ThemePreference } from './Models/Enums/ThemePreference';
import { ThemeService } from './Services/theme.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      // The app shell template only wraps <router-outlet>; the router is not
      // part of this unit-test module, so the outlet is left as an inert
      // custom element instead of importing RouterTestingModule.
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ChildrenOutletContexts, useValue: { getContext: () => null } },
        { provide: ApplicationRef, useValue: { tick: () => {} } },
        { provide: ThemeService, useValue: { getTheme: () => of(ThemePreference.Light) } }
      ]
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

    expect(document.body.classList.contains('light-theme')).toBeTrue();
  });
});
