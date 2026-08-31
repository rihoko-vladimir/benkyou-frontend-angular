import { Component, computed, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { accountInitialState } from '../../../../Redux/Reducers/account.reducer';
import { accountError, accountInfoSuccess, logout } from '../../../../Redux/Actions/account.actions';
import { AuthService } from '../../../../Services/auth.service';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';

@Component({
  selector: 'app-account-info-list-item',
  styleUrls: ['account-info-list-item.component.scss'],
  templateUrl: 'account-info-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class AccountInfoListItemComponent implements OnInit {
  private router = inject(Router);
  private store = inject<Store<AppState>>(Store);
  private authService = inject(AuthService);

  // Zoneless prep (commit A): store slice read via toSignal; the initial
  // value is the reducer's hydration default.
  account = toSignal(this.store.select(selectAccount), { initialValue: accountInitialState });
  avatarUrl = computed(() => this.account().avatarUrl);
  firstName = computed(() => this.account().firstName);
  lastName = computed(() => this.account().lastName);

  async onLogoutClicked() {
    this.store.dispatch(logout());
    await this.router.navigate(['auth']);
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
