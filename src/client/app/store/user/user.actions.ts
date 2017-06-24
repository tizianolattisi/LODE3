import {Credentials} from '../../service/model/credentials';
import {Action} from '@ngrx/store';
import {ErrorResponse} from '../../service/model/error-response';
import {ChangePasswordData} from '../../service/model/change-password';
import {ChangePasswordWithCodeData} from '../../service/model/change-password-with-code';

export const LOAD_TOKEN = '[User] LOAD_TOKEN';
export const SET_TOKEN = '[User] SET_TOKEN';

export const DO_LOGIN = '[User] DO_LOGIN';
export const LOGIN_SUCCESS = '[User] LOGIN_SUCCESS';
export const LOGIN_ERROR = '[User] LOGIN_ERROR';
export const DO_LOGOUT = '[User] DO_LOGOUT';

export const DO_SIGNUP = '[User] DO_SIGNUP';
export const SIGNUP_SUCCESS = '[User] SIGNUP_SUCCESS';
export const SIGNUP_ERROR = '[User] SIGNUP_ERROR';

export const DO_CONFIRM_ACCOUNT = '[User] DO_CONFIRM_ACCOUNT';
export const CONFIRM_ACCOUNT_SUCCESS = '[User] CONFIRM_ACCOUNT_SUCCESS';
export const CONFIRM_ACCOUNT_ERROR = '[User] CONFIRM_ACCOUNT_ERROR';

export const DO_PASSWORD_FORGOT = '[User] DO_PASSWORD_FORGOT';
export const PASSWORD_FORGOT_SUCCESS = '[User] PASSWORD_FORGOT_SUCCESS';
export const PASSWORD_FORGOT_ERROR = '[User] PASSWORD_FORGOT_ERROR';

export const DO_CHANGE_PASSWORD = '[User] DO_CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = '[User] CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_ERROR = '[User] CHANGE_PASSWORD_ERROR';

export const DO_CHANGE_PASSWORD_WITH_CODE = '[User] DO_CHANGE_PASSWORD_WITH_CODE';
export const CHANGE_PASSWORD_WITH_CODE_SUCCESS = '[User] CHANGE_PASSWORD_WITH_CODE_SUCCESS';
export const CHANGE_PASSWORD_WITH_CODE_ERROR = '[User] CHANGE_PASSWORD_WITH_CODE_ERROR';

export const DO_NEW_CONFIRMATION_CODE = '[User] DO_NEW_CONFIRMATION_CODE';
export const NEW_CONFIRMATION_CODE_SUCCESS = '[User] NEW_CONFIRMATION_CODE_SUCCESS';
export const NEW_CONFIRMATION_CODE_ERROR = '[User] NEW_CONFIRMATION_CODE_ERROR';


export class LoadToken implements Action {
  readonly type = LOAD_TOKEN;
}

export class SetToken implements Action {
  readonly type = SET_TOKEN;

  constructor(public payload: string) {}
}

export class Login implements Action {
  readonly type = DO_LOGIN;

  constructor(public payload: Credentials) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: string) {}
}

export class LoginError implements Action {
  readonly type = LOGIN_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class Logout implements Action {
  readonly type = DO_LOGOUT;
}

export class Signup implements Action {
  readonly type = DO_SIGNUP;

  constructor(public payload: Credentials) {}
}

export class SignupSuccess implements Action {
  readonly type = SIGNUP_SUCCESS;
}

export class SignupError implements Action {
  readonly type = SIGNUP_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class ConfirmAccount implements Action {
  readonly type = DO_CONFIRM_ACCOUNT;

  constructor(public payload: string) {}
}

export class ConfirmAccountSuccess implements Action {
  readonly type = CONFIRM_ACCOUNT_SUCCESS;
}

export class ConfirmAccountError implements Action {
  readonly type = CONFIRM_ACCOUNT_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class PasswordForgot implements Action {
  readonly type = DO_PASSWORD_FORGOT;

  constructor(public payload: string) {}
}

export class PasswordForgotSuccess implements Action {
  readonly type = PASSWORD_FORGOT_SUCCESS;
}

export class PasswordForgotError implements Action {
  readonly type = PASSWORD_FORGOT_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class ChangePassword implements Action {
  readonly type = DO_CHANGE_PASSWORD;

  constructor(public payload: ChangePasswordData) {}
}

export class ChangePasswordSuccess implements Action {
  readonly type = CHANGE_PASSWORD_SUCCESS;
}

export class ChangePasswordError implements Action {
  readonly type = CHANGE_PASSWORD_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class ChangePasswordWithCode implements Action {
  readonly type = DO_CHANGE_PASSWORD_WITH_CODE;

  constructor(public payload: ChangePasswordWithCodeData) {}
}

export class ChangePasswordWithCodeSuccess implements Action {
  readonly type = CHANGE_PASSWORD_WITH_CODE_SUCCESS;
}

export class ChangePasswordWithCodeError implements Action {
  readonly type = CHANGE_PASSWORD_WITH_CODE_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class NewConfirmationCode implements Action {
  readonly type = DO_NEW_CONFIRMATION_CODE;

  constructor(public payload: string) {}
}

export class NewConfirmationCodeSuccess implements Action {
  readonly type = NEW_CONFIRMATION_CODE_SUCCESS;
}

export class NewConfirmationCodeError implements Action {
  readonly type = NEW_CONFIRMATION_CODE_ERROR;

  constructor(public payload: ErrorResponse) {}
}


export type All
  = LoadToken
  | SetToken
  | Login
  | LoginSuccess
  | LoginError
  | Logout
  | Signup
  | SignupSuccess
  | SignupError
  | ConfirmAccount
  | ConfirmAccountSuccess
  | ConfirmAccountError
  | PasswordForgot
  | PasswordForgotSuccess
  | PasswordForgotError
  | ChangePassword
  | ChangePasswordSuccess
  | ChangePasswordError
  | ChangePasswordWithCode
  | ChangePasswordWithCodeSuccess
  | ChangePasswordWithCodeError
  | NewConfirmationCode
  | NewConfirmationCodeSuccess
  | NewConfirmationCodeError;
