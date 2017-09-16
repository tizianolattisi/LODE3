import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


export const EMAIL_REGEX: RegExp = /.+@.*\.?unitn\.it$/;

/**
 * Validate email using regex.
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      return control.value.match(EMAIL_REGEX) ? null : {'email': 'Email must be of type "name@unitn.it"'};
    } else {
      return null;
    }
  };
}
