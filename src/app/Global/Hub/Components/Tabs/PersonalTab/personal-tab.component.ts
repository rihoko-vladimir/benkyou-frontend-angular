import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import AppState from '../../../../../Redux/app.state';
import { selectAccount } from '../../../../../Redux/Selectors/selectors';
import { Account } from '../../../../../Models/Account';
import { AccountService } from '../../../../../Services/account.service';
import { IAccountState } from '../../../../../Redux/Reducers/account.reducer';
import { accountError, accountInfoSuccess } from '../../../../../Redux/Actions/account.actions';
import { visibilityChangeSuccess } from '../../../../../Redux/Actions/snackbar.actions';
import { mapUserResponseToAccountState } from '../../../../../Services/Helpers/converters';
import { MatButton } from '@angular/material/button';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'personal-tab',
  templateUrl: 'personal-tab.component.html',
  styleUrls: ['personal-tab.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatButton,
    MatNativeDateModule
  ]
})
export class PersonalTabComponent implements OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private accountService = inject(AccountService);

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

  constructor() {
    const store = this.store;

    this.subscription = store.select(selectAccount).subscribe(account => {
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
    const currentAccountInfo: Account = {
      firstName: this.accountState.firstName,
      lastName: this.accountState.lastName,
      about: this.accountState.about,
      userName: this.accountState.userName,
      birthDay: this.accountState.birthDay,
      isAccountPublic: this.accountState.isAccountPublic
    };
    this.accountService.updateUserAccount(currentAccountInfo, accountInfo).subscribe({
      next: userInfo => {
        if (this.accountState.isAccountPublic !== userInfo.isAccountPublic) {
          this.store.dispatch(visibilityChangeSuccess());
        }
        this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo)));
      },
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
  }
}
