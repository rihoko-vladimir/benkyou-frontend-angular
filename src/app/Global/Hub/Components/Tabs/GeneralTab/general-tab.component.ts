import {Component, OnDestroy} from "@angular/core";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import AppState from "../../../../../Redux/app.state";
import {Store} from "@ngrx/store";
import {AccountService} from "../../../../../Services/account.service";
import {Account} from "../../../../../Models/Account";
import {IAccountState} from "../../../../../Redux/Reducers/account.reducer";

@Component({
  selector: "general-tab",
  templateUrl: "general-tab.component.html",
  styleUrls: ["general-tab.component.css"]
})

export class GeneralTabComponent implements OnDestroy {
  accountInfo!: IAccountState
  isPublic: boolean = false
  subscription

  constructor(private store: Store<AppState>, private accountService: AccountService) {
    this.subscription = store.select("account").subscribe(accountInfo => {
      this.accountInfo = accountInfo
      this.isPublic = accountInfo.isAccountPublic
    })
  }

  onVisibilityChanged(event: MatSlideToggleChange) {
    let accountData: Account = {
      firstName: this.accountInfo.firstName,
      lastName: this.accountInfo.lastName,
      userName: this.accountInfo.userName,
      isAccountPublic: event.checked,
      birthDay: this.accountInfo.birthDay,
      about: this.accountInfo.about
    }
    this.accountService.updateUserAccount(accountData)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
