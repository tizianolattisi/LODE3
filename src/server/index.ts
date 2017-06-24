import Server from './server';
import * as chalk from 'chalk';
import * as mongoose from 'mongoose';
import {
  ENV_VAR_JWT_SECRET,
  ENV_VAR_DB_URL,
  ENV_VAR_DB_NAME,
  DB_COMPLETE_URL,
  ENV_VAR_SENDGRID_API_KEY,
  ENV_VAR_STORAGE_PATH,
  STORAGE_PATH
} from './commons/config';


// /////////////////////////////////////////
// Check mandatory environment variables
// /////////////////////////////////////////

if (!process.env[ENV_VAR_JWT_SECRET]) {
  console.warn(chalk.bold.yellow('> Jwt Secret has not been provided. Use the default one.'));
}
if (!process.env[ENV_VAR_DB_URL] || !process.env[ENV_VAR_DB_NAME]) {
  console.warn(chalk.bold.yellow(`> Db url and name has not been provided. Use the default one (${DB_COMPLETE_URL}).`));
}
if (!process.env[ENV_VAR_STORAGE_PATH]) {
  console.warn(chalk.bold.yellow(`> Storage path has not been provided. Use the default one (${STORAGE_PATH}).`));
}
if (!process.env[ENV_VAR_SENDGRID_API_KEY]) {
  console.error(
    chalk.bold.red(`> Sendgrid API Key has not been provided. Please provide it using env variable "${ENV_VAR_SENDGRID_API_KEY}".`));
  process.exit(-1);
}


// /////////////////////////////////////////
// Connect to Mongo DB
// /////////////////////////////////////////

(mongoose as any).Promise = global.Promise;

console.log(chalk.bold.blue(`> Connecting to database "${DB_COMPLETE_URL}"`));
mongoose.connect(DB_COMPLETE_URL, {}, (err) => {
  if (err) {
    console.error(chalk.bold.red('> Database connection error'), err);
  }
});


// /////////////////////////////////////////
// Run Server
// /////////////////////////////////////////

new Server().run();
