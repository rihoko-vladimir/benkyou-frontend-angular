import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { accountInitialState } from '../../../../Redux/Reducers/account.reducer';
import { AccountService } from '../../../../Services/account.service';
import { accountError, accountInfoSuccess } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { ErrorComponent } from '../../Components/ErrorComponent/error.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AccountInformationComponent } from '../../Components/AccountInformation/account-information.component';
import { AccountOverviewComponent } from '../../Components/AccountOverview/account-overview.component';

@Component({
  selector: 'app-account-page',
  templateUrl: 'account.component.html',
  styleUrls: ['account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountOverviewComponent, AccountInformationComponent, MatProgressSpinner, ErrorComponent]
})
export class AccountComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);
  private accountService = inject(AccountService);

  // Zoneless prep (commit A): store-driven flags become signal reads;
  // currentTab is purely event-driven so it stays a plain field.
  private accountState = toSignal(this.store.select(selectAccount), {
    initialValue: accountInitialState
  });
  isLoading = signal(false);
  isError = computed(() => this.accountState().error.isError);

  currentTab = 0;

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadAccountInfo();
  }

  onTabChanged(index: number) {
    this.currentTab = index;
  }

  onRetryClicked() {
    this.isLoading.set(true);
    this.loadAccountInfo();
  }

  private loadAccountInfo() {
    this.accountService.getAccountInfo().subscribe({
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
