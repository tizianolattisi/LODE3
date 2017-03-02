import {IUser} from "../models/db/User";
import {ConfirmCode} from "../models/db/ConfirmCode";
import {PasswordResetCode} from "../models/db/PasswordResetCode";
import {EMAIL_SENDER, SENDGRID_API_KEY} from "./config";
import * as sg from 'sendgrid';
import * as fs from 'fs';
import {Promise} from 'es6-promise';

const sendGrid = sg(SENDGRID_API_KEY);

/**
 * Send a account confirmation code email using SendGrid
 * @param hostname hostname of the server
 * @param user user account information
 * @return {Promise<boolean>} return a promise with true if email has been send correctly, false otherwise
 */
export const generateAndSendConfirmCode = (hostname: string, user: IUser): Promise<boolean> => {

    return new Promise<boolean>((resolve, reject) => {
        // generate confirm code
        let confirmCode = new ConfirmCode();
        confirmCode.code = confirmCode.generateConfirmCode();
        confirmCode.uid = user._id;

        confirmCode.save((err) => {
            if (err) {
                return reject(err);
            }

            let emailContentString = fs.readFileSync(__dirname + '/../resources/email/confirm.html', 'UTF-8');
            emailContentString = emailContentString.replace(/\$\{CODE_URL}/g, 'http://' + hostname + '/user/confirm-account?code=' + confirmCode.code);

            let mailHelper = sg.mail;
            let from = new mailHelper.Email(EMAIL_SENDER);
            let to = new mailHelper.Email(user.email);
            let subject = "Account confirmation";
            let content = new mailHelper.Content('text/html', emailContentString);
            let mail = new mailHelper.Mail(from, subject, to, content);

            sendEmail(mail)
                .then(res => {
                    console.log('Email sent');
                    console.log(res.statusCode + ' ' + res.body);
                    return resolve(true);
                }, err => {
                    console.error('Email sent error ' + err.response.statusCode);
                    return reject(err.response);
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
        let passResetCode = new PasswordResetCode();
        passResetCode.code = passResetCode.generatePasswordResetCode();
        passResetCode.email = email;
        passResetCode.expiration = passResetCode.getNewExpirationDate();

        passResetCode.save((err) => {
            if (err) {
                return reject(err);
            }

            let emailContentString = fs.readFileSync(__dirname + '/../resources/email/password-recover.html', 'UTF-8');
            emailContentString = emailContentString.replace(/\$\{CODE_URL}/g, 'http://' + hostname + '/user/reset-password?code=' + passResetCode.code);

            let mailHelper = sg.mail;
            let from = new mailHelper.Email(EMAIL_SENDER);
            let to = new mailHelper.Email(email);
            let subject = "Reset Account Password";
            let content = new mailHelper.Content('text/html', emailContentString);
            let mail = new mailHelper.Mail(from, subject, to, content);

            sendEmail(mail)
                .then(res => {
                    return resolve(true);
                }, err => {
                    console.error('Email sent error ' + err.response.statusCode);
                    return reject(err.response);
                });
        });
    });
};

const sendEmail = (mail: any) => {

    var request = sendGrid.emptyRequest(<any>{
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });
    return sendGrid.API(request);
};

const replaceAll = function (string, search, replacement) {
    return string.replace(new RegExp(search, 'g'), replacement);
};

