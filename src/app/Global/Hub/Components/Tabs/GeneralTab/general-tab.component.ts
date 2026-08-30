import { Component, OnDestroy } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import AppState from '../../../../../Redux/app.state';
import { Store } from '@ngrx/store';
import { AccountService } from '../../../../../Services/account.service';
import { Account } from '../../../../../Models/Account';
import { IAccountState } from '../../../../../Redux/Reducers/account.reducer';
import { accountError, loginSuccess } from '../../../../../Redux/Actions/account.actions';
import { visibilityChangeSuccess } from '../../../../../Redux/Actions/snackbar.actions';
import { mapUserResponseToAccountState } from '../../../../../Services/Helpers/converters';

@Component({
  selector: 'general-tab',
  templateUrl: 'general-tab.component.html',
  styleUrls: ['general-tab.component.scss']
})
export class GeneralTabComponent implements OnDestroy {
  accountInfo!: IAccountState;
  isPublic: boolean = false;
  subscription;

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService
  ) {
    this.subscription = store.select('account').subscribe(accountInfo => {
      this.accountInfo = accountInfo;
      this.isPublic = accountInfo.isAccountPublic;
    });
  }

  onVisibilityChanged(event: MatSlideToggleChange) {
    this.isPublic = !this.isPublic;
    const accountData: Account = {
      firstName: this.accountInfo.firstName,
      lastName: this.accountInfo.lastName,
      userName: this.accountInfo.userName,
      isAccountPublic: event.checked,
      birthDay: this.accountInfo.birthDay,
      about: this.accountInfo.about
    };
    const currentAccountData: Account = {
      firstName: this.accountInfo.firstName,
      lastName: this.accountInfo.lastName,
      userName: this.accountInfo.userName,
      isAccountPublic: this.accountInfo.isAccountPublic,
      birthDay: this.accountInfo.birthDay,
      about: this.accountInfo.about
    };
    this.accountService.updateUserAccount(currentAccountData, accountData).subscribe({
      next: userInfo => {
        if (this.accountInfo.isAccountPublic !== userInfo.isAccountPublic) {
          this.store.dispatch(visibilityChangeSuccess());
        }
        this.store.dispatch(loginSuccess(mapUserResponseToAccountState(userInfo)));
      },
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
