import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import AppState from '../../../../../Redux/app.state';
import { Account } from '../../../../../Models/Account';
import { AccountService } from '../../../../../Services/account.service';
import { IAccountState } from '../../../../../Redux/Reducers/account.reducer';

@Component({
  selector: 'personal-tab',
  templateUrl: 'personal-tab.component.html',
  styleUrls: ['personal-tab.component.scss']
})
export class PersonalTabComponent implements OnDestroy {
  minimalDate = new Date('1900/01/01');
  accountState!: IAccountState;
  isTouched: boolean = false;
  personalFormGroup = new FormGroup({
    firstNameControl: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    lastNameControl: new FormControl('', [Validators.required, Validators.maxLength(35)]),
    userNameControl: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    birthdayControl: new FormControl<Date | null>(null),
    aboutControl: new FormControl('', [Validators.maxLength(350)])
  });
  subscription;

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService
  ) {
    this.subscription = store.select('account').subscribe(account => {
      this.personalFormGroup.controls.firstNameControl.setValue(account.firstName);
      this.personalFormGroup.controls.lastNameControl.setValue(account.lastName);
      this.personalFormGroup.controls.userNameControl.setValue(account.userName);
      this.personalFormGroup.controls.birthdayControl.setValue(new Date(account.birthDay));
      this.personalFormGroup.controls.aboutControl.setValue(account.about);
      this.accountState = account;
      this.isTouchedCallback();
    });
    this.personalFormGroup.valueChanges.subscribe(() => this.isTouchedCallback());
  }

  isTouchedCallback() {
    const controls = this.personalFormGroup.controls;
    this.isTouched =
      controls.firstNameControl.value! !== this.accountState.firstName ||
      controls.lastNameControl.value! !== this.accountState.lastName ||
      controls.userNameControl.value! !== this.accountState.userName ||
      controls.aboutControl.value! !== this.accountState.about ||
      controls.birthdayControl.value?.getTime() !== new Date(this.accountState.birthDay).getTime();
  }

  getFirstNameError() {
    if (this.personalFormGroup.controls.firstNameControl.hasError(Validators.required.name))
      return 'This field is required';
    if (this.personalFormGroup.controls.firstNameControl.hasError('maxlength'))
      return 'This field can not be longer than 20 characters';
    return 'Unknown error';
  }

  getLastNameError() {
    if (this.personalFormGroup.controls.lastNameControl.hasError(Validators.required.name))
      return 'This field is required';
    if (this.personalFormGroup.controls.lastNameControl.hasError('maxlength'))
      return 'This field can not be longer than 35 characters';
    return 'Unknown error';
  }

  getUserNameError() {
    if (this.personalFormGroup.controls.userNameControl.hasError(Validators.required.name))
      return 'This field is required';
    if (this.personalFormGroup.controls.userNameControl.hasError('maxlength'))
      return 'This field can not be longer than 10 characters';
    return 'Unknown error';
  }

  getAboutError() {
    if (this.personalFormGroup.controls.aboutControl.hasError('maxlength'))
      return 'This field can not be longer than 350 characters';
    return 'Unknown error';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAccountSaveClicked() {
    const accountInfo: Account = {
      firstName: this.personalFormGroup.controls.firstNameControl.value!,
      lastName: this.personalFormGroup.controls.lastNameControl.value!,
      about: this.personalFormGroup.controls.aboutControl.value!,
      userName: this.personalFormGroup.controls.userNameControl.value!,
      birthDay: this.personalFormGroup.controls.birthdayControl.value?.toDateString() ?? null,
      isAccountPublic: this.accountState.isAccountPublic
    };
    this.accountService.updateUserAccount(accountInfo);
  }
}
