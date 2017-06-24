import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


export const PASSWORD_REGEX: RegExp = /[a-zA-Z]*[0-9]+[a-zA-Z]*/;

/**
 * Validate password using regex.
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      return control.value.match(PASSWORD_REGEX) ? null : {'password': 'Password must contain at least a digit'};
    } else {
      return null;
    }
  };
}
