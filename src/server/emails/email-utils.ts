import {IUser} from '../models/db/User';
import {ConfirmCode} from '../models/db/ConfirmCode';
import {PasswordResetCode} from '../models/db/PasswordResetCode';
import {MailData} from '@sendgrid/helpers/classes/mail';
import {Promise} from 'es6-promise';
import {EMAIL_SENDER, SENDGRID_API_KEY} from '../commons/config';

const sgMail = require('@sendgrid/mail');
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';

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

      let emailContentString = fs.readFileSync(path.resolve(__dirname, '../resources/email/confirm.html'), 'UTF-8');
      emailContentString = emailContentString.replace(/\$\{CODE_URL}/g,
        'http://' + hostname + '/user/confirm-account?code=' + confirmCode.code);


      // Send email
      const mail: MailData = {
        to: user.email,
        from: {email: EMAIL_SENDER, name: 'LODE'},
        subject: 'Account confirmation',
        html: emailContentString
      };

      console.log(chalk.default.blue(`Sending a confirmation email...`));

      sgMail.send(mail)
        .then(res => {
          console.log(chalk.default.green(`Confirmation email sent (status: ${res[0].statusCode}, body: ${res[0].body})`));
          return resolve(true);
        }, mErr => {
          let mailErr = null;
          if (mErr && mErr.response && mErr.response.body) {
            mailErr = mErr.response.body.errors;
          }
          console.log(chalk.default.bold.red(`> Error while sending 'Accoun confirmation' email`), mailErr);
          return reject(mErr);
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

      let emailContentString = fs.readFileSync(path.resolve(__dirname, '../resources/email/password-recover.html'), 'UTF-8');
      emailContentString = emailContentString.replace(/\$\{CODE_URL}/g,
        'http://' + hostname + '/user/reset-password?code=' + passResetCode.code);


      // Send email
      const mail: MailData = {
        to: email,
        from: {email: EMAIL_SENDER, name: 'LODE'},
        subject: 'Reset Account Password',
        html: emailContentString
      };

      console.log(chalk.default.blue(`Sending a reset password account email...`));

      sgMail.send(mail)
        .then(res => {
          console.log(chalk.default.green(`Reset password email sent (status: ${res[0].statusCode}, body: ${res[0].body})`));
          return resolve(true);
        }, mErr => {
          let mailErr = null;
          if (mErr && mErr.response && mErr.response.body) {
            mailErr = mErr.response.body.errors;
          }
          console.log(chalk.default.bold.red(`> Error while sending 'Reset Accoun Password' email`), mailErr);
          return reject(mErr);
        });

    });
  });
};
