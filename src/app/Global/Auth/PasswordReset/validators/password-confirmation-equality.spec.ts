import { FormGroup, FormControl } from '@angular/forms';
import { PasswordConfirmationEqualityValidator } from './password-confirmation-equality';

describe('PasswordConfirmationEqualityValidator', () => {
  const makeGroup = (password: string, confirmation: string) =>
    new FormGroup({
      password: new FormControl(password),
      passwordConfirmation: new FormControl(confirmation)
    });

  it('returns null when both fields match', () => {
    const group = makeGroup('secret', 'secret');
    const validator = PasswordConfirmationEqualityValidator('password', 'passwordConfirmation');

    const result = validator(group);

    expect(result).toBeNull();
  });

  it('returns an error keyed by the validator name and sets it on the confirmation control when values differ', () => {
    const group = makeGroup('secret', 'different');
    const validator = PasswordConfirmationEqualityValidator('password', 'passwordConfirmation');

    const result = validator(group);

    expect(result).toEqual({ PasswordConfirmationEqualityValidator: true });
    expect(group.get('passwordConfirmation')!.errors).toEqual({ PasswordConfirmationEqualityValidator: true });
  });

  it('clears the stale mismatch error once the values match again', () => {
    const group = makeGroup('secret', 'different');
    const validator = PasswordConfirmationEqualityValidator('password', 'passwordConfirmation');
    validator(group);

    group.get('password')!.setValue('different');
    const result = validator(group);

    expect(result).toBeNull();
    expect(group.get('passwordConfirmation')!.errors).toBeNull();
  });

  it('keeps other validation errors on the confirmation control when the values match', () => {
    const group = makeGroup('secret', 'different');
    const validator = PasswordConfirmationEqualityValidator('password', 'passwordConfirmation');
    validator(group);
    group.get('passwordConfirmation')!.setErrors({
      PasswordConfirmationEqualityValidator: true,
      minlength: true
    });

    group.get('password')!.setValue('different');
    const result = validator(group);

    expect(result).toBeNull();
    expect(group.get('passwordConfirmation')!.errors).toEqual({ minlength: true });
  });
});
