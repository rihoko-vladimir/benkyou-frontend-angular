import { AnimationTransitionMetadata } from '@angular/animations';
import { tabSwitchAnimations } from './hub-route.animations';

describe('tabSwitchAnimations', () => {
  it('defines the routeAnimations trigger with the study transitions', () => {
    expect(tabSwitchAnimations.name).toBe('routeAnimations');

    const transitionSelectors = tabSwitchAnimations.definitions.map(
      definition => (definition as AnimationTransitionMetadata).expr
    );

    expect(transitionSelectors).toEqual(['* => Study', 'Study => *', '* <=> *']);
  });
});
