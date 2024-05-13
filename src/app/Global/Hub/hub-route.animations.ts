import { animate, query, style, transition, trigger } from '@angular/animations';

export const tabSwitchAnimations = trigger('routeAnimations', [
  transition('* => Study', [
    style({
      position: 'relative',
      right: '-100vh'
    }),
    animate(
      '300ms cubic-bezier(0, 0, 0.3, 0.6)',
      style({
        right: '0'
      })
    )
  ]),

  transition('Study => *', [
    query(':enter', [
      style({
        position: 'relative',
        top: '100vh'
      }),
      animate(
        '300ms cubic-bezier(0, 0, 0.2, 0.9)',
        style({
          top: '0'
        })
      )
    ])
  ]),
  transition('* <=> *', [
    style({
      opacity: 0
    }),
    animate(
      '350ms cubic-bezier(0, 0, 0.3, 0.6)',
      style({
        opacity: 1
      })
    )
  ])
]);
