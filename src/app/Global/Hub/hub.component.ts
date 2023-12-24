import {Component, OnDestroy} from "@angular/core";
import {ChildrenOutletContexts, NavigationEnd, Router, RouterOutlet} from "@angular/router";
import AppState from "../../Redux/app.state";
import {Store} from "@ngrx/store";
import {dismissSnackbar} from "../../Redux/Actions/snackbar.actions";
import {tabSwitchAnimations} from "./hub-route.animations";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: "hub-component",
  styleUrls: ["hub.component.css"],
  templateUrl: "hub.component.html",
  animations: [
    tabSwitchAnimations
  ]
})

export class HubComponent implements OnDestroy {
  isShown: boolean
  subscription
  storeSubscription

  constructor(private router: Router, private store: Store<AppState>, private snackbar: MatSnackBar, private contexts: ChildrenOutletContexts) {
    this.isShown = false
    this.subscription = router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.isShown = value.url != "/hub/study";
      }
    })
    this.storeSubscription = store.select("snackbar").subscribe(value => {
      if (value.isShown)
        this.showSnackbar(value.message)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.storeSubscription.unsubscribe()
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, undefined, {
      duration: 3000,
      verticalPosition: "bottom",
      horizontalPosition: "start",
    }).afterDismissed().subscribe(() => {
      this.store.dispatch(dismissSnackbar())
    })
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
  }

  getHubRoutingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
