import { FormGroup } from "@angular/forms";

export class RepeatPasswordValidator {
  public static repeatPassword(): any {
    return (group: FormGroup): void => {
      const password = group.controls['password'];
      const passwordConfirmation = group.controls['password_confirmation'];

      if (password.value !== passwordConfirmation.value) {
        passwordConfirmation.setErrors({ notEquivalent: true });

      } else {
        passwordConfirmation.setErrors(null)

      }
    }
  }
}