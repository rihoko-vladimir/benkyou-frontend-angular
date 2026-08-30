import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { accountError, loginSuccess, logout } from '../../../../Redux/Actions/account.actions';
import { AuthService } from '../../../../Services/auth.service';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';

@Component({
  selector: 'account-info-list-item',
  styleUrls: ['account-info-list-item.component.scss'],
  templateUrl: 'account-info-list-item.component.html'
})
export class AccountInfoListItemComponent implements OnDestroy, OnInit {
  avatarUrl: string = '';
  firstName: string = '';
  lastName: string = '';
  subscription;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.subscription = store.select('account').subscribe(value => {
      this.avatarUrl = value.avatarUrl;
      this.firstName = value.firstName;
      this.lastName = value.lastName;
    });
  }

  async onLogoutClicked() {
    this.store.dispatch(logout());
    await this.router.navigate(['auth']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: userInfo => this.store.dispatch(loginSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
