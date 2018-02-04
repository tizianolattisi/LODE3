import {Router} from 'express';
import {JWT_SECRET, PASSWORD_PATTERN, SERVER_API_PATH} from '../commons/config';
import {generateAndSendConfirmCode, generateAndSendPasswordResetCode} from '../emails/email-utils';
import {ErrorResponse} from '../models/api/ErrorResponse';
import {NotAuthenticatedResponse} from '../models/api/NotAuthenticatedResponse';
import {Validation} from '../models/Validation';
import * as jwt from 'jsonwebtoken';
import * as validate from 'express-validation';
import {User, IUser} from '../models/db/User';
import {PasswordResetCode, IPasswordResetCode} from '../models/db/PasswordResetCode';
import {ConfirmCode, IConfirmCode} from '../models/db/ConfirmCode';


const PATH = '/user';

const router: Router = Router();

const PUBLIC_PATHS = [
  `${SERVER_API_PATH}/${PATH}/login`,
  `${SERVER_API_PATH}/${PATH}/logout`,
  `${SERVER_API_PATH}/${PATH}/signup`,
  `${SERVER_API_PATH}/${PATH}/password-change-with-code`,
  `${SERVER_API_PATH}/${PATH}/password-forgot`,
  `${SERVER_API_PATH}/${PATH}/new-confirm-code`,
  `${SERVER_API_PATH}/${PATH}/enable-account`
];

/**
 * Login API
 * 'email' and 'password' are required in body.
 */
router.post(PATH + '/login', validate(Validation.credentials), (req, res, next) => {

  User.findOne({email: req.body.email}, (err, user: IUser) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json(new ErrorResponse('UserNotExist', 'User not exist'));
    }

    // check password and if enabled
    if (user.enabled && user.validPassword(req.body.password)) {

      // authenticated! -> generate new jwt token
      return res.json({token: jwt.sign(user.toJSON(), JWT_SECRET, {expiresIn: '4 days'})});
    } else {
      return next(new NotAuthenticatedResponse());
    }
  });
});

/**
 * Logout API
 */
router.get(PATH + '/logout', (req, res, next) => {
  // do nothing
  return res.sendStatus(204);
});

/**
 * Signup API
 * 'email' and 'password' are required in body.
 */
router.post(PATH + '/signup', validate(Validation.credentials), (req, res, next) => {

  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.status(400).json(new ErrorResponse('user_already_exist', 'User already registered'));
    }

    const u = new User();
    u.email = req.body.email;
    u.password = u.generatePasswordHash(req.body.password);
    u.enabled = false;
    u.type = 'student';
    u.lectures = [];

    u.save((e, savedUser: IUser) => {
      if (e) {
        return next(e);
      }
      res.sendStatus(204);
      generateAndSendConfirmCode(req.hostname, savedUser);
    });
  });
});

/**
 * Profile API. Return the profile data of a user
 */
router.get(PATH + '/profile', (req, res, next) => {

  User.findById(req.user.id, (err, user: IUser) => {
    if (err) {
      return next(err);
    }
    return res.json(user.getUserProfile());
  });
});

/* -----
 * Management
 ----- */


/**
 * Allow change the password of an account
 */
router.post(PATH + '/password-change', (req, res, next) => {
  return res.sendStatus(501);
});

/**
 * Allow change the password of an account with code provided via email
 */
router.post(PATH + '/password-change-with-code', validate(Validation.passwordCodeChange), (req, res, next) => {

  // check password constraint
  if (req.body.password.length < 6 || !PASSWORD_PATTERN.test(req.body.password)) {
    return res
      .status(400)
      .json(new ErrorResponse('BadPassword', 'Password should be at least 6 characters and contain at least a number.'));
  }

  PasswordResetCode.findOne({code: req.body.code}, (err, passwordResetCode: IPasswordResetCode) => {
    if (err) {
      return next(err);
    }
    if (!passwordResetCode) {
      return res.status(400).json(new ErrorResponse('CodeNotExist', 'Provided code is not valid'));
    }
    if (passwordResetCode.isExpired()) {
      return res.status(400).json(new ErrorResponse('CodeExpired', 'Provided code is expired'));
    }

    User.findOne({email: passwordResetCode.email}, (err, user: IUser) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json(new ErrorResponse('UserNotExist', 'User not exist'));
      }

      user.password = user.generatePasswordHash(req.body.password);
      user.save((err) => {
        if (err) {
          return next(err);
        }
        return res.sendStatus(204);
      });
    });
  });
});

/**
 * Request an email containing a code for password changing
 */
router.post(PATH + '/password-forgot', validate(Validation.email), (req, res, next) => {

  generateAndSendPasswordResetCode(req.hostname, req.body.email)
    .then(done => {
      return res.sendStatus(204);
    })
    .catch(err => {
      return next(err);
    });
});

/**
 * Request a new account confirmation code
 */
router.post(PATH + '/new-confirm-code', validate(Validation.email), (req, res, next) => {

  User.findOne({email: req.body.email}, (err, user: IUser) => {
    if (err) {
      return next(err);
    }

    if (user && !user.enabled) {
      generateAndSendConfirmCode(req.hostname, user)
        .then(done => {
          return res.sendStatus(204);
        })
        .catch(error => {
          return next(error);
        });
    } else {
      return res.status(400).json(new ErrorResponse('WrongUser', 'User note exist or already enabled'));
    }
  });
});

/**
 * Given a confirmation code, enable an account
 */
router.post(PATH + '/enable-account', validate(Validation.code), (req, res, next) => {

  ConfirmCode.findOne({code: req.body.code}, (err, confirmCode: IConfirmCode) => {
    if (err) {
      return next(err);
    }
    if (!confirmCode) {
      return res.status(400).json(new ErrorResponse('CodeNotExist', 'Provided code is not valid'));
    }

    User.findById(confirmCode.uid.toString(), (err, user: IUser) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json(new ErrorResponse('UserNotExist', 'User not exist'));
      }

      user.enabled = true;
      user.save((err) => {
        if (err) {
          return next(err);
        }
        return res.sendStatus(204);
      });
    });
  });
});

export {router as UserRouter, PATH as USER_PATH, PUBLIC_PATHS as PUBLIC_USER_PATHS};
