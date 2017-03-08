import {Router} from 'express';
import cache = require('memory-cache');
import validate = require('express-validation');
import {PdfCache} from "../models/common/PdfCache";
import {fetchPdf, calculateHash} from "../commons/pdf/pdfUtils";
import {PDF_CACHE_DAYS, INDEX_HTML_NAME} from "../commons/config";
import {Response} from "express";


const entrypointRouterPublic: Router = Router();

/**
 * Entry point of the web applications editor and lecturer
 * It provide an html page with injected all the information
 * needed from the web application.
 */

function editorAndLecturerEntryPoint(req, res, next){

    let pdfUrl: string = req.body.pdfUrl;

    // check if pdf file is already cached
    let pdfCache: PdfCache = cache.get(pdfUrl);

    if (pdfCache) {
        return res.render(INDEX_HTML_NAME, {pdfHash: pdfCache.hash});
    } else {

        // fetch pdf file and then complete the request
        fetchPdf(pdfUrl, res, (response) => {
            loadPdf(response, pdfUrl, {}, res);
        });
    }

}
entrypointRouterPublic.post('/editor', editorAndLecturerEntryPoint);
entrypointRouterPublic.post('/lecturer', editorAndLecturerEntryPoint);

/**
 * Entry point of the web application video lecture.
 * It provide an html page with injected all the information
 * needed from the web application to make the video lecture page work.
 */
entrypointRouterPublic.post('/video', (req, res, next) => {

    let pdfUrl: string = req.body.pdfUrl;
    let course: string = req.body.course;
    let lecture: string = req.body.lecture;

    // check if pdf file is already cached
    let pdfCache: PdfCache = cache.get(pdfUrl);

    if (pdfCache) {
        return res.render(INDEX_HTML_NAME, {
            pdfHash: pdfCache.hash,
            course: course,
            lecture: lecture
        });
    } else {

        // fetch pdf file and then complete the request
        fetchPdf(pdfUrl, res, (response) => {
            loadPdf(response, pdfUrl, {course: course, lecture: lecture}, res);
        });
    }

});


/**
 * This is a callback for pdf files download requests.
 * It collect pdf file incoming data, puts them in cache and complete an entry point request.
 * @param response of the download pdf request
 * @param pdfUrl location of the pdf file to fetch
 * @param params params injected in html file
 * @param res Express Response to which send the html page
 */
const loadPdf = (response, pdfUrl: string, params: any, res: Response) => {
    var chunks: Buffer[] = [];

    response.on('data', (chunk)=> {
        // save temporally data
        chunks.push(chunk);
    });

    response.on('end', ()=> {
        let data = Buffer.concat(chunks);

        // calculate hash and save pdf in cache
        let hash = calculateHash(data);

        // save pdf information in cache
        let pdfCache = {url: pdfUrl, hash: hash, data: data};
        cache.put(pdfUrl, pdfCache, PDF_CACHE_DAYS * 24 * 60 * 60);
        cache.put(hash, pdfCache, PDF_CACHE_DAYS * 24 * 60 * 60);

        // add pdf hash to params and complete the request
        params.pdfHash = pdfCache.hash;
        return res.render(INDEX_HTML_NAME, params);
    });
};

export {entrypointRouterPublic};