import {NotFoundResponse} from "../models/rest/errorResponses";

/**
 * Handle not found API path
 */
export function notFoundErrorHandler(req, res, next) {
    res.status(404).json(new NotFoundResponse());
}

/**
 * Handle an unauthorized API request
 */
export function notAuthorizedErrorHandler(err, req, res, next) {

    if (err.name === 'UnauthorizedError' || err.code === 'UnauthorizedError' || err.status == 401) {
        res.status(401).json(err);
    } else {
        next(err);
    }
}

/**
 * Handle a API bad request
 */
export function badRequestErrorHandler(err, req, res, next) {
    if (err.status == 400) {
        console.error(err);
        res.status(400).json(err);
    } else {
        next(err);
    }
}

/**
 * Handle generic server errors
 */
export function serverErrorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json(err);
}