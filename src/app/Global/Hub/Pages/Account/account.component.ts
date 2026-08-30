import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { AccountService } from '../../../../Services/account.service';
import { ErrorComponent } from '../../Components/ErrorComponent/error.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AccountInformationComponent } from '../../Components/AccountInformation/account-information.component';
import { AccountOverviewComponent } from '../../Components/AccountOverview/account-overview.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'account-page',
  templateUrl: 'account.component.html',
  styleUrls: ['account.component.scss'],
  standalone: true,
  imports: [NgIf, AccountOverviewComponent, AccountInformationComponent, MatProgressSpinner, ErrorComponent]
})
export class AccountComponent implements OnInit, OnDestroy {
  currentTab: number = 0;
  isLoading: boolean = false;
  isError: boolean = false;
  subscription;

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService
  ) {
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
    this.accountService.getAccountInfo();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRetryClicked() {
    this.isLoading = true;
    this.accountService.getAccountInfo();
  }
}
