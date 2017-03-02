import http = require('http');
import https = require('https');
import crypto = require('crypto');
import URL = require('url');
import {Response} from "@types/express";

/**
 * Fetch a pdf from the given url
 * @param pdfUrl location of the pdf
 * @param response Express response. Used in case of errors
 * @param callback callback to handle the http request
 */
export const fetchPdf = (pdfUrl: string, response: Response, callback: (response)=>void) => {

    if (pdfUrl.indexOf('http') == -1) { // http module not accept urls without protocol
        pdfUrl = 'http://' + pdfUrl;
    }

    let url = URL.parse(pdfUrl);
    let protocol = (url.protocol == 'https:') ? https : http;

    if (!url.protocol) {
        pdfUrl = 'http://' + pdfUrl;
    }
    (<any>protocol).get(pdfUrl, callback)
        .on('error', (err)=> {
            console.error(err);
            response.sendStatus(404);
        });
};

/**
 * Calculate the md5 hash of a file
 * @param data bytes
 * @return {any|string} md5 hash
 */
export const calculateHash = (data: Buffer): string => {
    return crypto.createHash('md5').update(data).digest('hex');
};