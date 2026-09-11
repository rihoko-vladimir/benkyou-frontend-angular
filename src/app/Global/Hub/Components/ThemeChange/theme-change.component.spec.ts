import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { ThemeService } from '../../../../Services/theme.service';
import { ThemePreference } from '../../../../Models/Enums/ThemePreference';
import { ThemeChangeComponent } from './theme-change.component';

describe('ThemeChangeComponent', () => {
  let component: ThemeChangeComponent;
  let fixture: ComponentFixture<ThemeChangeComponent>;
  let theme$: BehaviorSubject<ThemePreference | undefined>;
  let themeServiceMock: {
    getTheme: () => BehaviorSubject<ThemePreference | undefined>;
    setTheme: ReturnType<typeof vi.fn>;
  };

  const setup = (initial: ThemePreference | undefined) => {
    theme$ = new BehaviorSubject<ThemePreference | undefined>(initial);
    themeServiceMock = {
      getTheme: () => theme$,
      setTheme: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [ThemeChangeComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }]
    });
    fixture = TestBed.createComponent(ThemeChangeComponent);
    component = fixture.componentInstance;
  };

  it('shows the "Switch to Light Theme" tooltip and contrast icon in Auto mode', () => {
    setup(ThemePreference.Auto);
    fixture.detectChanges();

    expect(component.tooltip()).toBe('Switch to Light Theme');
    expect(fixture.nativeElement.textContent).toContain('contrast');
  });

  it('shows the "Switch to System Theme" tooltip and dark_mode icon in Dark mode', () => {
    setup(ThemePreference.Dark);
    fixture.detectChanges();

    expect(component.tooltip()).toBe('Switch to System Theme');
    expect(fixture.nativeElement.textContent).toContain('dark_mode');
  });

  it('shows the "Switch to Dark Theme" tooltip and light_mode icon in Light mode', () => {
    setup(ThemePreference.Light);
    fixture.detectChanges();

    expect(component.tooltip()).toBe('Switch to Dark Theme');
    expect(fixture.nativeElement.textContent).toContain('light_mode');
  });

  it('falls back to an empty tooltip for an unrecognised theme value', () => {
    setup(undefined);
    fixture.detectChanges();

    expect(component.tooltip()).toBe('');
  });

  it('cycles Auto -> Light on changeTheme', () => {
    setup(ThemePreference.Auto);
    fixture.detectChanges();

    component.changeTheme();

    expect(themeServiceMock.setTheme).toHaveBeenCalledWith(ThemePreference.Light);
  });

  it('cycles Dark -> Auto on changeTheme', () => {
    setup(ThemePreference.Dark);
    fixture.detectChanges();

    component.changeTheme();

    expect(themeServiceMock.setTheme).toHaveBeenCalledWith(ThemePreference.Auto);
  });

  it('cycles Light -> Dark on changeTheme', () => {
    setup(ThemePreference.Light);
    fixture.detectChanges();

    component.changeTheme();

    expect(themeServiceMock.setTheme).toHaveBeenCalledWith(ThemePreference.Dark);
  });

  it('does nothing for an unrecognised theme value on changeTheme', () => {
    setup(undefined);
    fixture.detectChanges();

    component.changeTheme();

    expect(themeServiceMock.setTheme).not.toHaveBeenCalled();
  });

  it('invokes changeTheme when the button is clicked', () => {
    setup(ThemePreference.Auto);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(themeServiceMock.setTheme).toHaveBeenCalledWith(ThemePreference.Light);
  });
});
