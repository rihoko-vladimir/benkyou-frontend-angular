import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { AccountService } from '../../../../Services/account.service';
import { accountError, accountInfoSuccess } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { ErrorComponent } from '../../Components/ErrorComponent/error.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AccountInformationComponent } from '../../Components/AccountInformation/account-information.component';
import { AccountOverviewComponent } from '../../Components/AccountOverview/account-overview.component';

@Component({
  selector: 'account-page',
  templateUrl: 'account.component.html',
  styleUrls: ['account.component.scss'],
  imports: [AccountOverviewComponent, AccountInformationComponent, MatProgressSpinner, ErrorComponent]
})
export class AccountComponent implements OnInit, OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private accountService = inject(AccountService);

  currentTab: number = 0;
  isLoading: boolean = false;
  isError: boolean = false;
  subscription;

  constructor() {
    const store = this.store;

    this.subscription = store.select(selectAccount).subscribe(account => {
      this.isLoading = false;
      this.isError = account.error.isError;
    });
  }

  onTabChanged(index: number) {
    this.currentTab = index;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadAccountInfo();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRetryClicked() {
    this.isLoading = true;
    this.loadAccountInfo();
  }

  private loadAccountInfo() {
    this.accountService.getAccountInfo().subscribe({
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
