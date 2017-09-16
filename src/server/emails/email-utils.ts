import {User, IUser} from '../models/db/User';
import {ConfirmCode} from '../models/db/ConfirmCode';
import {PasswordResetCode} from '../models/db/PasswordResetCode';
import {MailData} from '@sendgrid/helpers/classes/mail';
import {Promise} from 'es6-promise';
import {EMAIL_SENDER, SENDGRID_API_KEY} from '../commons/config';

const sgMail = require('@sendgrid/mail');
import * as fs from 'fs';

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Send a account confirmation code email using SendGrid
 * @param hostname hostname of the server
 * @param user user account information
 * @return {Promise<boolean>} return a promise with true if email has been send correctly, false otherwise
 */
export const generateAndSendConfirmCode = (hostname: string, user: IUser): Promise<boolean> => {

  return new Promise<boolean>((resolve, reject) => {
    // generate confirm code
    const confirmCode = new ConfirmCode();
    confirmCode.code = confirmCode.generateConfirmCode();
    confirmCode.uid = user._id;

    confirmCode.save((err) => {
      if (err) {
        return reject(err);
      }

      let emailContentString = fs.readFileSync(__dirname + '/../resources/email/confirm.html', 'UTF-8');
      emailContentString = emailContentString.replace(/\$\{CODE_URL}/g,
        'http://' + hostname + '/user/confirm-account?code=' + confirmCode.code);


      // Send email
      const mail: MailData = {
        to: user.email,
        from: EMAIL_SENDER,
        subject: 'Account confirmation',
        html: emailContentString
      };

      sgMail.send(mail)
        .then(res => {
          console.log('Email sent');
          console.log(res[0].statusCode + ' ' + res[0].body);
          return resolve(true);
        }, mailErr => {
          console.error('Email sent error ', mailErr);
          return reject(mailErr);
        });

    });
  });
};

/**
 * Send a password reset code via email using SendGrid
 * @param hostname hostname of the server
 * @param email email of the user
 * @return {Promise<boolean>} return a promise with true if email has been send correctly, false otherwise
 */
export const generateAndSendPasswordResetCode = (hostname: string, email: string): Promise<boolean> => {

  return new Promise<boolean>((resolve, reject) => {
    // generate code
    const passResetCode = new PasswordResetCode();
    passResetCode.code = passResetCode.generatePasswordResetCode();
    passResetCode.email = email;
    passResetCode.expiration = passResetCode.getNewExpirationDate();

    passResetCode.save((err) => {
      if (err) {
        return reject(err);
      }

      let emailContentString = fs.readFileSync(__dirname + '/../resources/email/password-recover.html', 'UTF-8');
      emailContentString = emailContentString.replace(/\$\{CODE_URL}/g,
        'http://' + hostname + '/user/reset-password?code=' + passResetCode.code);


      // Send email
      const mail: MailData = {
        to: email,
        from: EMAIL_SENDER,
        subject: 'Reset Account Password',
        html: emailContentString
      };

      sgMail.send(mail)
        .then(res => {
          return resolve(true);
        }, mailErr => {
          console.error('Email sent error ', mailErr);
          return reject(mailErr);
        });

    });
  });
};


const replaceAll = function (string, search, replacement) {
  return string.replace(new RegExp(search, 'g'), replacement);
};

