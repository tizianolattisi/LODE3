
// /////////////////////////////////////////
// Environment variables names
// /////////////////////////////////////////

export const ENV_VAR_SERVER_PORT = 'SERVER_PORT';
export const ENV_VAR_JWT_SECRET = 'JWT_SECRET';
export const ENV_VAR_DB_URL = 'DB_URL';
export const ENV_VAR_DB_NAME = 'DB_NAME';
export const ENV_VAR_STORAGE_PATH = 'STORAGE_PATH';
export const ENV_VAR_SENDGRID_API_KEY = 'SENDGRID_API_KEY';
export const ENV_VAR_EMAIL_SENDER = 'SENDGRID_API_KEY';

// /////////////////////////////////////////
// Configuration parameters
// /////////////////////////////////////////

export const SERVER_API_PATH = '/api';
export const SERVER_STORAGE_PATH = '/storage';

export const SERVER_PORT: number = parseInt(process.env[ENV_VAR_SERVER_PORT], 10) || 8080;
export const JWT_SECRET: string = (process.env[ENV_VAR_JWT_SECRET]) || 'snjdic4939c45m9u45gmg9md3489md439cm394m';

export const DB_NAME = (process.env[ENV_VAR_DB_NAME]) || 'lode';
export const DB_COMPLETE_URL: string = (process.env[ENV_VAR_DB_URL]) ?
  (process.env[ENV_VAR_DB_URL] + DB_NAME) : ('mongodb://localhost:27017/' + DB_NAME);

export const STORAGE_PATH: string = (process.env[ENV_VAR_STORAGE_PATH]) || '/tmp/lode';
export const STORAGE_SLIDES_FOLDER = 'slides';

export const SENDGRID_API_KEY: string = (process.env[ENV_VAR_SENDGRID_API_KEY]) || '';
export const EMAIL_SENDER: string = (process.env[ENV_VAR_EMAIL_SENDER]) || 'mail@lode.it';

export const SOCKET_AUTH_TIMEOUT = 15000;
export const ALLOWED_EMAIL_REGEX: RegExp = /.+@.*\.?unitn\.it$/;
export const PASSWORD_PATTERN: RegExp = /[a-zA-Z]*[0-9]+[a-zA-Z]*/;
export const CACHE_DAYS = 7;
export const LODE_BASE_URL = 'http://latemar.science.unitn.it/cad/lectures';
