// secret use to produce JWT tokens
export const JWT_SECRET: string = (process.env['JWT_SECRET']) || '*';

/* -----
 * DB
 ----- */

export const DB_NAME = (process.env['DB_NAME']) || 'annotations_db';
export const DATABASE_URL: string = (process.env['MONGODB_URL']) ? (process.env['MONGODB_URL'] + DB_NAME) : ('mongodb://localhost:27017/' + DB_NAME);

/* -----
 * Emails
 ----- */

export const SENDGRID_API_KEY: string = (process.env['SENDGRID_API_KEY']) || ('*');
// Address seen from the recipient
export const EMAIL_SENDER: string = (process.env['EMAIL_SENDER']) || 'mail@annotations.com';

export const PDF_CACHE_DAYS: number = 7;
export const LODE_BASE_URL: string = 'http://latemar.science.unitn.it/cad/lectures';

export const INDEX_HTML_NAME = (process.env['ENV'] == 'dev') ? ('index-dev.html') : ('index.html');