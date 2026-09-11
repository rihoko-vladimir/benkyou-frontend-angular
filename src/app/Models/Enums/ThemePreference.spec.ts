import { ThemePreference } from './ThemePreference';

describe('ThemePreference', () => {
  it('numbers Light, Dark and Auto in order', () => {
    expect(ThemePreference.Light).toBe(0);
    expect(ThemePreference.Dark).toBe(1);
    expect(ThemePreference.Auto).toBe(2);
  });

  it('maps each value back to its name', () => {
    expect(ThemePreference[ThemePreference.Light]).toBe('Light');
    expect(ThemePreference[ThemePreference.Dark]).toBe('Dark');
    expect(ThemePreference[ThemePreference.Auto]).toBe('Auto');
  });
});
