import { Component, OnDestroy, inject } from '@angular/core';
import {
  ChildrenOutletContexts,
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import AppState from '../../Redux/app.state';
import { selectSnackbar } from '../../Redux/Selectors/selectors';
import { Store } from '@ngrx/store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { dismissSnackbar } from '../../Redux/Actions/snackbar.actions';
import { tabSwitchAnimations } from './hub-route.animations';
import { ThemeChangeComponent } from './Components/ThemeChange/theme-change.component';
import { AccountInfoListItemComponent } from './Components/AccountInfoListItem/account-info-list-item.component';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';

@Component({
  selector: 'hub-component',
  styleUrls: ['hub.component.scss'],
  templateUrl: 'hub.component.html',
  animations: [tabSwitchAnimations],
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatDivider,
    AccountInfoListItemComponent,
    ThemeChangeComponent,
    MatDrawerContent,
    RouterOutlet,
    MatSnackBarModule
  ]
})
export class HubComponent implements OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private snackbar = inject(MatSnackBar);
  private contexts = inject(ChildrenOutletContexts);

  isShown: boolean;
  subscription;
  storeSubscription;

  constructor() {
    const router = inject(Router);
    const store = this.store;

    this.isShown = false;
    this.subscription = router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.isShown = value.url !== '/hub/study';
      }
    });
    this.storeSubscription = store.select(selectSnackbar).subscribe(value => {
      if (value.isShown) this.showSnackbar(value.message);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.storeSubscription.unsubscribe();
  }

  showSnackbar(message: string) {
    this.snackbar
      .open(message, undefined, {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'start'
      })
      .afterDismissed()
      .subscribe(() => {
        this.store.dispatch(dismissSnackbar());
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  getHubRoutingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
