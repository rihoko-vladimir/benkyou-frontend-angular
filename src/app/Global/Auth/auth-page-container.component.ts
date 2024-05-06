import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { cardsChangeAnimation } from '../../Animations/auth-page.animations';

@Component({
  selector: 'auth-page-container',
  templateUrl: 'auth-page-container.component.html',
  styleUrls: ['auth-page-container.component.css'],
  animations: [cardsChangeAnimation]
})
export class AuthPageContainerComponent {
  constructor(private contexts: ChildrenOutletContexts) {}
  getAuthRoutingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
