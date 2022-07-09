import {Component, OnDestroy} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "hub-component",
  styleUrls: ["hub.component.css"],
  templateUrl: "hub.component.html"
})

export class HubComponent implements OnDestroy{
  isShown : boolean
  subscription
  constructor(private router: Router) {
    this.isShown = false
    this.subscription = router.events.subscribe(value => {
      if (value instanceof NavigationEnd){
        this.isShown = value.url != "/hub/study";
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
