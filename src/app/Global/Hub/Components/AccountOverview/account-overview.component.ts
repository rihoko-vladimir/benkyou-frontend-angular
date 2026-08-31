import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { AccountService } from '../../../../Services/account.service';
import { accountError, accountInfoSuccess } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { accountInitialState } from '../../../../Redux/Reducers/account.reducer';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-account-overview',
  templateUrl: 'account-overview.component.html',
  styleUrls: ['account-overview.component.scss'],
  animations: [
    trigger('changeButton', [
      transition(':enter', [
        style({
          transform: 'scale(0)'
        }),
        animate(
          '150ms',
          style({
            transform: 'scale(1)'
          })
        )
      ]),
      transition(':leave', [
        style({
          transform: 'scale(1)'
        }),
        animate(
          '150ms',
          style({
            transform: 'scale(0)'
          })
        )
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatIcon, MatMiniFabButton]
})
export class AccountOverviewComponent implements OnChanges {
  private store = inject<Store<AppState>>(Store);
  private accountService = inject(AccountService);

  @Input() currentTab = 0;
  @ViewChild('fileInput') fileInput?: ElementRef;

  // Zoneless prep (commit A): account slice via toSignal; local file
  // upload state as writable signals.
  private accountState = toSignal(this.store.select(selectAccount), { initialValue: accountInitialState });
  firstName = computed(() => this.accountState().firstName);
  lastName = computed(() => this.accountState().lastName);
  avatarUrl = computed(() => this.accountState().avatarUrl);
  selectedFile = signal<File | undefined>(undefined);
  fileImage = signal<ArrayBuffer | undefined>(undefined);

  constructor() {
    // The old subscribe callback cleared the pending file selection every
    // time the account slice changed; effect() preserves that behavior.
    effect(() => {
      this.accountState();
      this.resetFileSelection();
    });
  }

  resetFileSelection() {
    if (this.fileInput !== undefined) {
      this.fileInput!.nativeElement.value = '';
    }
    this.selectedFile.set(undefined);
    this.fileImage.set(undefined);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0] ?? undefined;
    this.selectedFile.set(file);
    if (file !== undefined) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = event => {
        this.fileImage.set(event!.target!.result as ArrayBuffer);
      };
    }
  }

  ngOnChanges(): void {
    this.resetFileSelection();
  }

  onChange() {
    this.accountService.uploadNewAvatar(this.selectedFile()!).subscribe({
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }

  onDiscard() {
    this.resetFileSelection();
  }
}
