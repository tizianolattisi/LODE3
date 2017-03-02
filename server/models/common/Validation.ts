import Joi = require('joi');

/**
 * Class containing validation criteria used to check
 * data coming from requests
 */
export default class Validation {

    static credentials = {
        body: {
            email: Joi.string().email().regex(/.+@.*\.?unitn\.it$/).required(),
            password: Joi.string().regex(/[a-zA-Z]*[0-9]+[a-zA-Z]*/).min(6).required()
        }
    };

    static passwordCodeChange = {
        body: {
            code: Joi.string().required(),
            password: Joi.string().regex(/[a-zA-Z]*[0-9]+[a-zA-Z]*/).min(6).required()
        }
    };

    static email = {
        body: {
            email: Joi.string().email().regex(/.+@.*\.?unitn\.it$/).required()
        }
    };

    static code = {
        body: {
            code: Joi.string().required()
        }
    };

    // entry point

    static editor = {
        body: {
            pdfUrl: Joi.string().uri().required()
        }
    };

    static video = {
        body: {
            pdfUrl: Joi.string().uri().required(),
            course: Joi.string().required(),
            lecture: Joi.string().required()
        }
    };


}