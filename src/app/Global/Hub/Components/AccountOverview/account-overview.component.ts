import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild, inject } from '@angular/core';
import AppState from '../../../../Redux/app.state';
import { selectAccount } from '../../../../Redux/Selectors/selectors';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { AccountService } from '../../../../Services/account.service';
import { accountError, accountInfoSuccess } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { MatCard } from '@angular/material/card';

@Component({
  selector: 'account-overview',
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
  imports: [MatCard, MatIcon, MatMiniFabButton]
})
export class AccountOverviewComponent implements OnDestroy, OnChanges {
  private store = inject<Store<AppState>>(Store);
  private accountService = inject(AccountService);

  @Input() currentTab: number = 0;
  @ViewChild('fileInput') fileInput?: ElementRef;
  subscription;
  firstName: string = '';
  lastName: string = '';
  avatarUrl: string = '';
  selectedFile?: File;
  fileImage?: ArrayBuffer;

  constructor() {
    const store = this.store;

    this.subscription = store.select(selectAccount).subscribe(value => {
      this.firstName = value.firstName;
      this.lastName = value.lastName;
      this.avatarUrl = value.avatarUrl;
      if (this.fileInput !== undefined) {
        this.fileInput!.nativeElement.value = '';
      }
      this.selectedFile = undefined;
      this.fileImage = undefined;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files![0] ?? undefined;
    if (this.selectedFile !== undefined) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedFile);
      fileReader.onload = event => {
        this.fileImage = event!.target!.result as ArrayBuffer;
      };
    }
  }

  ngOnChanges(): void {
    if (this.fileInput !== undefined) {
      this.fileInput!.nativeElement.value = '';
    }
    this.selectedFile = undefined;
    this.fileImage = undefined;
  }

  onChange() {
    this.accountService.uploadNewAvatar(this.selectedFile!).subscribe({
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }

  onDiscard() {
    this.fileInput!.nativeElement.value = '';
    this.selectedFile = undefined;
    this.fileImage = undefined;
  }
}
