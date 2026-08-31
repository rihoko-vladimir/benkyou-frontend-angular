import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  ChildrenOutletContexts,
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
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
  selector: 'app-hub-component',
  styleUrls: ['hub.component.scss'],
  templateUrl: 'hub.component.html',
  animations: [tabSwitchAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class HubComponent {
  private store = inject<Store<AppState>>(Store);
  private snackbar = inject(MatSnackBar);
  private contexts = inject(ChildrenOutletContexts);

  // Zoneless prep (commit A): convert subscription→plain-property read
  // surfaces to signals. toSignal() binds to this component's injector and
  // tears itself down on destroy; effect() replaces subscribe-side effects.
  // Reads in the template go through signals so zoneless schedules CD.
  isShown = toSignal(
    inject(Router).events.pipe(map((e): boolean => e instanceof NavigationEnd && e.url !== '/hub/study')),
    { initialValue: false }
  );

  private snackbarState = toSignal(this.store.select(selectSnackbar), { initialValue: null });

  constructor() {
    effect(() => {
      const value = this.snackbarState();
      if (value?.isShown) this.showSnackbar(value.message);
    });
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
