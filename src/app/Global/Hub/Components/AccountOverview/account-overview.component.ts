import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import AppState from '../../../../Redux/app.state';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { AccountService } from '../../../../Services/account.service';

@Component({
  selector: 'account-overview',
  templateUrl: 'account-overview.component.html',
  styleUrls: ['account-overview.component.css'],
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
  ]
})
export class AccountOverviewComponent implements OnDestroy, OnChanges {
  @Input() currentTab: number = 0;
  @ViewChild('fileInput') fileInput?: ElementRef;
  subscription;
  firstName: string = '';
  lastName: string = '';
  avatarUrl: string = '';
  selectedFile?: File;
  fileImage?: ArrayBuffer;

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService
  ) {
    this.subscription = store.select('account').subscribe(value => {
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
    this.accountService.uploadNewAvatar(this.selectedFile!);
  }

  onDiscard() {
    this.fileInput!.nativeElement.value = '';
    this.selectedFile = undefined;
    this.fileImage = undefined;
  }
}
