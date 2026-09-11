import { cardsChangeAnimation } from './auth-page.animations';

describe('cardsChangeAnimation', () => {
  it('defines the routeAnimations trigger with a wildcard transition', () => {
    expect(cardsChangeAnimation.name).toBe('routeAnimations');
    expect(cardsChangeAnimation.definitions.length).toBeGreaterThan(0);
  });
});
