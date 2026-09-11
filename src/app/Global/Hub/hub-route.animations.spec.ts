import { tabSwitchAnimations } from './hub-route.animations';

describe('tabSwitchAnimations', () => {
  it('defines the routeAnimations trigger with the study transitions', () => {
    expect(tabSwitchAnimations.name).toBe('routeAnimations');
    expect(tabSwitchAnimations.definitions.length).toBe(3);
  });
});
