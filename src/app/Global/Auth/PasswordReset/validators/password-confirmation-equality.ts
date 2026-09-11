import { AbstractControl, ValidatorFn } from '@angular/forms';

export function PasswordConfirmationEqualityValidator(
  passwordFieldName: string,
  passwordConfirmationFieldName: string
): ValidatorFn {
  return (controls: AbstractControl) => {
    const passwordControl = controls.get(passwordFieldName)!;
    const passwordConfirmationControl = controls.get(passwordConfirmationFieldName)!;
    if (passwordControl.value !== passwordConfirmationControl.value) {
      const error = {
        [PasswordConfirmationEqualityValidator.name]: true
      };
      passwordConfirmationControl.setErrors(error);
      return error;
    } else {
      if (passwordConfirmationControl.hasError(PasswordConfirmationEqualityValidator.name)) {
        const remainingErrors = { ...passwordConfirmationControl.errors };
        delete remainingErrors[PasswordConfirmationEqualityValidator.name];
        passwordConfirmationControl.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
      }
      return null;
    }
  };
}
