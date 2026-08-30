import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { cardsChangeAnimation } from '../../Animations/auth-page.animations';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'auth-page-container',
  templateUrl: 'auth-page-container.component.html',
  styleUrls: ['auth-page-container.component.css'],
  animations: [cardsChangeAnimation],
  standalone: true,
  imports: [MatCard, RouterOutlet]
})
export class AuthPageContainerComponent {
  constructor(private contexts: ChildrenOutletContexts) {}
  getAuthRoutingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
