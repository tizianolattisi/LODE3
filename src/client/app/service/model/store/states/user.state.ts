import {ErrorResponse} from '../../error-response';

export interface UserState {
  token: string;
  email: string;
  redirectUrl: string;

  loadingLogin: boolean;
  errorLogin: ErrorResponse;

  loadingSignup: boolean;
  sucessSignup: boolean;
  errorSignup: ErrorResponse;

  loadingConfirmAccount: boolean;
  successConfirmAccount: boolean;
  errorConfirmAccount: ErrorResponse;

  loadingPasswordForgot: boolean;
  successPasswordForgot: boolean;
  errorPasswordForgot: ErrorResponse;

  loadingChangePassword: boolean;
  successChangePassword: boolean;
  errorChangePassword: ErrorResponse;

  loadingChangePasswordWithCode: boolean;
  successChangePasswordWithCode: boolean;
  errorChangePasswordWithCode: ErrorResponse;

  loadingNewConfirmationCode: boolean;
  successNewConfirmationCode: boolean;
  errorNewConfirmationCode: ErrorResponse;
}
