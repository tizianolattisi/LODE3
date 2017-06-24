import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Store} from '@ngrx/store';
import {AppState} from '../../model/store/app-state';
import {Credentials} from '../../model/credentials';
import {ChangePassword} from '../../model/change-password';
import * as chalk from 'chalk';
import {ChangePasswordWithCode} from '../../model/change-password-with-code';
import {responseToError} from '../../model/error-response';

@Injectable()
export class UserAction {

  static DO_LOGIN = '[User] DO_LOGIN';
  static LOGIN_SUCCESS = '[User] LOGIN_SUCCESS';
  static LOGIN_ERROR = '[User] LOGIN_ERROR';
  static DO_LOGOUT = '[User] DO_LOGOUT';

  static DO_SIGNUP = '[User] DO_SIGNUP';
  static SIGNUP_SUCCESS = '[User] SIGNUP_SUCCESS';
  static SIGNUP_ERROR = '[User] SIGNUP_ERROR';

  static DO_CONFIRM_ACCOUNT = '[User] DO_CONFIRM_ACCOUNT';
  static CONFIRM_ACCOUNT_SUCCESS = '[User] CONFIRM_ACCOUNT_SUCCESS';
  static CONFIRM_ACCOUNT_ERROR = '[User] CONFIRM_ACCOUNT_ERROR';

  static DO_PASSWORD_FORGOT = '[User] DO_PASSWORD_FORGOT';
  static PASSWORD_FORGOT_SUCCESS = '[User] PASSWORD_FORGOT_SUCCESS';
  static PASSWORD_FORGOT_ERROR = '[User] PASSWORD_FORGOT_ERROR';

  static DO_CHANGE_PASSWORD = '[User] DO_CHANGE_PASSWORD';
  static CHANGE_PASSWORD_SUCCESS = '[User] CHANGE_PASSWORD_SUCCESS';
  static CHANGE_PASSWORD_ERROR = '[User] CHANGE_PASSWORD_ERROR';

  static DO_CHANGE_PASSWORD_WITH_CODE = '[User] DO_CHANGE_PASSWORD_WITH_CODE';
  static CHANGE_PASSWORD_WITH_CODE_SUCCESS = '[User] CHANGE_PASSWORD_WITH_CODE_SUCCESS';
  static CHANGE_PASSWORD_WITH_CODE_ERROR = '[User] CHANGE_PASSWORD_WITH_CODE_ERROR';

  static DO_NEW_CONFIRMATION_CODE = '[User] DO_NEW_CONFIRMATION_CODE';
  static NEW_CONFIRMATION_CODE_SUCCESS = '[User] NEW_CONFIRMATION_CODE_SUCCESS';
  static NEW_CONFIRMATION_CODE_ERROR = '[User] NEW_CONFIRMATION_CODE_ERROR';


  constructor(private store: Store<AppState>) {}

  doLogin(credentials: Credentials) {
    this.store.dispatch({type: UserAction.DO_LOGIN, payload: credentials});
  };

  loginSuccess(token: string) {
    this.store.dispatch({type: UserAction.LOGIN_SUCCESS, payload: token});
  };

  loginError(res: Response) {
    console.log('eeeeerrrr', res.json(), responseToError(res));
    this.store.dispatch({type: UserAction.LOGIN_ERROR, payload: responseToError(res)});
  };

  doLogout() {
    this.store.dispatch({type: UserAction.DO_LOGOUT});
  };

  doSignup(credentials: Credentials) {
    this.store.dispatch({type: UserAction.DO_SIGNUP, payload: credentials});
  };

  signupSuccess() {
    this.store.dispatch({type: UserAction.SIGNUP_SUCCESS});
  };

  signupError(res: Response) {
    this.store.dispatch({type: UserAction.SIGNUP_ERROR, payload: responseToError(res)});
  };

  doConfirmAccount(code: string) {
    this.store.dispatch({type: UserAction.DO_CONFIRM_ACCOUNT, payload: code});
  }

  confirmAccountSuccess() {
    this.store.dispatch({type: UserAction.CONFIRM_ACCOUNT_SUCCESS});
  }

  confirmAccountError(res: Response) {
    this.store.dispatch({type: UserAction.CONFIRM_ACCOUNT_ERROR, payload: responseToError(res)});
  };

  doPasswordForgot(email: string) {
    this.store.dispatch({type: UserAction.DO_PASSWORD_FORGOT, payload: email});
  }

  passwordForgotSuccess() {
    this.store.dispatch({type: UserAction.PASSWORD_FORGOT_SUCCESS});
  }

  passwordForgotError(res: Response) {
    this.store.dispatch({type: UserAction.PASSWORD_FORGOT_ERROR, payload: responseToError(res)});
  };

  doChangePassword(changePassword: ChangePassword) {
    this.store.dispatch({type: UserAction.DO_CHANGE_PASSWORD, payload: changePassword});
  }

  changePasswordSuccess() {
    this.store.dispatch({type: UserAction.CHANGE_PASSWORD_SUCCESS});
  }

  changePasswordError(res: Response) {
    this.store.dispatch({type: UserAction.CHANGE_PASSWORD_ERROR, payload: responseToError(res)});
  };

  doChangePasswordWithCode(changePasswordWithCode: ChangePasswordWithCode) {
    this.store.dispatch({type: UserAction.DO_CHANGE_PASSWORD_WITH_CODE, payload: changePasswordWithCode});
  }

  changePasswordWithCodeSuccess() {
    this.store.dispatch({type: UserAction.CHANGE_PASSWORD_WITH_CODE_SUCCESS});
  }

  changePasswordWithCodeError(res: Response) {
    this.store.dispatch({type: UserAction.CHANGE_PASSWORD_WITH_CODE_ERROR, payload: responseToError(res)});
  };

  doRequestNewConfirmationCode(email: string) {
    this.store.dispatch({type: UserAction.DO_NEW_CONFIRMATION_CODE, payload: email});
  }

  requestNewConfirmationCodeSuccess() {
    this.store.dispatch({type: UserAction.NEW_CONFIRMATION_CODE_SUCCESS});
  }

  requestNewConfirmationCodeError(res: Response) {
    this.store.dispatch({type: UserAction.NEW_CONFIRMATION_CODE_ERROR, payload: responseToError(res)});
  };
}
