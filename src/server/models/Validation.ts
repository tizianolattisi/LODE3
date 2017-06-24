import * as Joi from 'joi';
import { ALLOWED_EMAIL_REGEX, PASSWORD_PATTERN } from '../commons/config';


// ////////////////////////////////////////
// This object contains the schemas
// used to validate the requests payloads
// of the http API requests.
// ////////////////////////////////////////

export const Validation = {

  credentials: {
    body: {
      email: Joi.string().email().regex(ALLOWED_EMAIL_REGEX).required(),
      password: Joi.string().regex(PASSWORD_PATTERN).min(6).required()
    }
  },

  passwordCodeChange: {
    body: {
      code: Joi.string().required(),
      password: Joi.string().regex(PASSWORD_PATTERN).min(6).required()
    }
  },

  email: {
    body: {
      email: Joi.string().email().regex(ALLOWED_EMAIL_REGEX).required()
    }
  },

  code: {
    body: {
      code: Joi.string().required()
    }
  }
};
