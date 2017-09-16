import {AuthService} from '../../service/auth.service';
import * as UserActions from './user.actions';
import {UserState} from './user.state';

export type Action = UserActions.All;


const initialState: UserState = {
  token: '',
  email: '',
  redirectUrl: '',
  loadingLogin: false,
  errorLogin: null,

  loadingSignup: false,
  sucessSignup: false,
  errorSignup: null,

  loadingConfirmAccount: false,
  successConfirmAccount: false,
  errorConfirmAccount: null,

  loadingPasswordForgot: false,
  successPasswordForgot: false,
  errorPasswordForgot: null,

  loadingChangePassword: false,
  successChangePassword: false,
  errorChangePassword: null,

  loadingChangePasswordWithCode: false,
  successChangePasswordWithCode: false,
  errorChangePasswordWithCode: null,

  loadingNewConfirmationCode: false,
  successNewConfirmationCode: false,
  errorNewConfirmationCode: null
}

export function userReducer(state: UserState = initialState, action: Action): UserState {

  switch (action.type) {

    case UserActions.DO_LOGIN:
      return {
        ...state,
        loadingLogin: true,
        errorLogin: null
      };

    case UserActions.LOGIN_SUCCESS:
      // Get extra info
      const decodedToken = AuthService.getTokenPayload(action.payload);
      return {
        ...state,
        email: decodedToken.email,
        token: action.payload,
        loadingLogin: false,
        errorLogin: null
      };

    case UserActions.LOGIN_ERROR:
      return {
        ...state,
        email: '',
        token: '',
        loadingLogin: false,
        errorLogin: action.payload
      };

    case UserActions.DO_LOGOUT:
      return {
        ...state,
        email: '',
        token: '',
        loadingLogin: false,
        errorLogin: null
      };

    case UserActions.DO_SIGNUP:
      return {
        ...state,
        loadingSignup: true,
        sucessSignup: false,
        errorSignup: null
      };

    case UserActions.SIGNUP_SUCCESS:
      return {
        ...state,
        loadingSignup: false,
        sucessSignup: true,
        errorSignup: null
      };

    case UserActions.SIGNUP_ERROR:
      return {
        ...state,
        loadingSignup: false,
        sucessSignup: false,
        errorSignup: action.payload
      };

    case UserActions.DO_CONFIRM_ACCOUNT:
      return {
        ...state,
        loadingConfirmAccount: true,
        successConfirmAccount: false,
        errorConfirmAccount: null
      };

    case UserActions.CONFIRM_ACCOUNT_SUCCESS:
      return {
        ...state,
        loadingConfirmAccount: false,
        successConfirmAccount: true,
        errorConfirmAccount: null
      };

    case UserActions.CONFIRM_ACCOUNT_ERROR:
      return {
        ...state,
        loadingConfirmAccount: false,
        successConfirmAccount: false,
        errorConfirmAccount: action.payload
      };

    case UserActions.DO_PASSWORD_FORGOT:
      return {
        ...state,
        loadingPasswordForgot: true,
        successPasswordForgot: false,
        errorPasswordForgot: null
      };

    case UserActions.PASSWORD_FORGOT_SUCCESS:
      return {
        ...state,
        loadingPasswordForgot: false,
        successPasswordForgot: true,
        errorPasswordForgot: null
      };

    case UserActions.PASSWORD_FORGOT_ERROR:
      return {
        ...state,
        loadingPasswordForgot: false,
        successPasswordForgot: false,
        errorPasswordForgot: action.payload
      };

    case UserActions.DO_CHANGE_PASSWORD:
      return {
        ...state,
        loadingChangePassword: true,
        successChangePassword: false,
        errorChangePassword: null
      };

    case UserActions.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loadingChangePassword: false,
        successChangePassword: true,
        errorChangePassword: null
      };

    case UserActions.CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        loadingChangePassword: false,
        successChangePassword: false,
        errorChangePassword: action.payload
      };

    case UserActions.DO_CHANGE_PASSWORD_WITH_CODE:
      return {
        ...state,
        loadingChangePasswordWithCode: true,
        successChangePasswordWithCode: false,
        errorChangePasswordWithCode: null
      };

    case UserActions.CHANGE_PASSWORD_WITH_CODE_SUCCESS:
      return {
        ...state,
        loadingChangePasswordWithCode: false,
        successChangePasswordWithCode: true,
        errorChangePasswordWithCode: null
      };

    case UserActions.CHANGE_PASSWORD_WITH_CODE_ERROR:
      return {
        ...state,
        loadingChangePasswordWithCode: false,
        successChangePasswordWithCode: false,
        errorChangePasswordWithCode: action.payload
      };

    case UserActions.DO_NEW_CONFIRMATION_CODE:
      return {
        ...state,
        loadingNewConfirmationCode: true,
        successNewConfirmationCode: false,
        errorNewConfirmationCode: null
      };

    case UserActions.NEW_CONFIRMATION_CODE_SUCCESS:
      return {
        ...state,
        loadingNewConfirmationCode: false,
        successNewConfirmationCode: true,
        errorNewConfirmationCode: null
      };

    case UserActions.NEW_CONFIRMATION_CODE_ERROR:
      return {
        ...state,
        loadingNewConfirmationCode: false,
        successNewConfirmationCode: false,
        errorNewConfirmationCode: action.payload
      };

    default:
      return state;
  }
}

