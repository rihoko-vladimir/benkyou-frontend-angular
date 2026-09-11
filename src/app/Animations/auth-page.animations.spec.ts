import { AnimationMetadataType } from '@angular/animations';
import { cardsChangeAnimation } from './auth-page.animations';

describe('cardsChangeAnimation', () => {
  it('fades between any two routes with the wildcard transition', () => {
    expect(cardsChangeAnimation.name).toBe('routeAnimations');
    expect(cardsChangeAnimation.definitions).toEqual([
      {
        type: AnimationMetadataType.Transition,
        expr: '* <=> *',
        animation: [
          { type: AnimationMetadataType.Style, styles: { opacity: 0 }, offset: null },
          { type: AnimationMetadataType.Animate, styles: null, timings: '400ms ease-out' }
        ],
        options: null
      }
    ]);
  });
});
