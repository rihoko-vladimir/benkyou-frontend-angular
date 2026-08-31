import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import AppState from '../../../../../Redux/app.state';
import { selectAccount } from '../../../../../Redux/Selectors/selectors';
import { Store } from '@ngrx/store';
import { AccountService } from '../../../../../Services/account.service';
import { Account } from '../../../../../Models/Account';
import { accountInitialState } from '../../../../../Redux/Reducers/account.reducer';
import { accountError, accountInfoSuccess } from '../../../../../Redux/Actions/account.actions';
import { visibilityChangeSuccess } from '../../../../../Redux/Actions/snackbar.actions';
import { mapUserResponseToAccountState } from '../../../../../Services/Helpers/converters';

@Component({
  selector: 'app-general-tab',
  templateUrl: 'general-tab.component.html',
  styleUrls: ['general-tab.component.scss'],
  imports: [MatSlideToggle]
})
export class GeneralTabComponent {
  private store = inject<Store<AppState>>(Store);
  private accountService = inject(AccountService);

  // Zoneless prep (commit A): account slice via toSignal.
  accountInfo = toSignal(this.store.select(selectAccount), { initialValue: accountInitialState });

  onVisibilityChanged(event: MatSlideToggleChange) {
    const accountInfo = this.accountInfo();
    const accountData: Account = {
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
      userName: accountInfo.userName,
      isAccountPublic: event.checked,
      birthDay: accountInfo.birthDay,
      about: accountInfo.about
    };
    const currentAccountData: Account = {
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
      userName: accountInfo.userName,
      isAccountPublic: accountInfo.isAccountPublic,
      birthDay: accountInfo.birthDay,
      about: accountInfo.about
    };
    this.accountService.updateUserAccount(currentAccountData, accountData).subscribe({
      next: userInfo => {
        if (accountInfo.isAccountPublic !== userInfo.isAccountPublic) {
          this.store.dispatch(visibilityChangeSuccess());
        }
        this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo)));
      },
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
