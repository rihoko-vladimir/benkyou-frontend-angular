import {animate, style, transition, trigger} from "@angular/animations";


export const cardsChangeAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({opacity: 0}),
      animate('400ms ease-out')]),
  ]);

// export const pageChangeAnimation =
//   trigger('routeAnimations', [
//     transition('auth => hub', [
//       group([
//         animate('300ms ease', style({
//             transform: 'translateY(-100%)'
//           }
//         )),
//         query()
//       ])
//     ]),
//   ])
