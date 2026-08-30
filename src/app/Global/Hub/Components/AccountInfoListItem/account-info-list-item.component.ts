import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { accountError, accountInfoSuccess, logout } from '../../../../Redux/Actions/account.actions';
import { AuthService } from '../../../../Services/auth.service';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';

@Component({
  selector: 'account-info-list-item',
  styleUrls: ['account-info-list-item.component.scss'],
  templateUrl: 'account-info-list-item.component.html',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatRipple,
    MatIcon,
    NgOptimizedImage,
    MatListItem,
    RouterLink,
    RouterLinkActive
  ]
})
export class AccountInfoListItemComponent implements OnDestroy, OnInit {
  private router = inject(Router);
  private store = inject<Store<AppState>>(Store);
  private authService = inject(AuthService);

  avatarUrl: string = '';
  firstName: string = '';
  lastName: string = '';
  subscription;

  constructor() {
    const store = this.store;

    this.subscription = store.select(selectAccount).subscribe(value => {
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
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
