import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { accountError, accountInfoSuccess, logout } from '../../../../Redux/Actions/account.actions';
import { AuthService } from '../../../../Services/auth.service';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';

@Component({
  selector: 'account-info-list-item',
  styleUrls: ['account-info-list-item.component.scss'],
  templateUrl: 'account-info-list-item.component.html',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatRipple,
    NgIf,
    MatIcon,
    NgOptimizedImage,
    MatListItem,
    RouterLink,
    RouterLinkActive
  ]
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
