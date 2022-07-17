import {Component, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import AppState from "../../../../Redux/app.state";
import {AccountService} from "../../../../Services/account.service";

@Component({
  selector: "account-page",
  templateUrl: "account.component.html",
  styleUrls: ["account.component.css"]
})

export class AccountComponent implements OnInit, OnDestroy{
  currentTab : number = 0
  isLoading : boolean = false
  isError : boolean = false
  subscription

  constructor(private store : Store<AppState>, private accountService : AccountService) {
    this.subscription = store.select("account").subscribe(account => {
      this.isLoading = false
      this.isError = account.error.isError
    })
  }

  onTabChanged(index: number) {
    this.currentTab = index
  }

  ngOnInit(): void {
    this.isLoading = true
    this.accountService.getAccountInfo()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onRetryClicked() {
    this.isLoading = true
    this.accountService.getAccountInfo()
  }
}
