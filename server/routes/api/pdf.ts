import {Router} from 'express';
import cache = require('memory-cache');
import http = require('http');
import https = require('https');
import URL = require('url');
import {Annotation, IAnnotation} from "../../models/db/Annotation";
import {writeAnnotations} from "../../commons/pdf/writeAnnotations";
import {PdfCache} from "../../models/common/PdfCache";

const pdfRouter: Router = Router();
const PATH = '/pdfs';


/**
 * Get a pdf file available in cache. If pdf is not cached, 404 is returned.
 */
pdfRouter.get(PATH + '/:pdfId', (req, res, next) => {

    let pdfHash: string = req.params.pdfId;
    let pdfData: PdfCache = cache.get(pdfHash);

    if (pdfData) {
        res.set('Content-Type', 'application/pdf');
        res.write(pdfData.data);
        return res.end();
    } else {
        return res.sendStatus(404);
    }
});

/**
 * Get a pdf file with all the annotations of a user.
 * If pdf file is not cached, 404 is returned.
 */
pdfRouter.get(PATH + '/:pdfId/download', (req, res, next)=> {

    let pdfHash = req.params.pdfId;
    let pdfData: PdfCache = cache.get(pdfHash);

    if (pdfData) {

        // get annotations
        Annotation.find({
            pdfId: pdfData.hash,
            uid: req.user.id
        }).exec((err, annotations: IAnnotation[])=> {
            if (err) {
                return next(err);
            }

            if (annotations.length == 0) {
                // send pdf
                res.set('Content-Type', 'application/pdf');
                res.write(pdfData.data);
                res.end();
            } else {
                // write annotations and send pdf
                writeAnnotations(pdfData, annotations, (err, result)=> {
                    if (err) {
                        return next(err);
                    }
                    res.set('Content-Type', 'application/pdf');
                    res.write(result);
                    res.end();
                });
            }
        });
    } else {
        res.sendStatus(404);
    }
});

export {pdfRouter};