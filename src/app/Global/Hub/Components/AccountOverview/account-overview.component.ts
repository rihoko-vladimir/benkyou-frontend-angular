import {Component, OnDestroy} from "@angular/core";
import AppState from "../../../../Redux/app.state";
import {Store} from "@ngrx/store";

@Component({
  selector: "account-overview",
  templateUrl: "account-overview.component.html",
  styleUrls: ["account-overview.component.css"]
})

export class AccountOverviewComponent implements OnDestroy {
  subscription
  firstName: string = ""
  lastName: string = ""

  constructor(private store: Store<AppState>) {
    this.subscription = store.select("account").subscribe(value => {
      this.firstName = value.firstName
      this.lastName = value.lastName
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
