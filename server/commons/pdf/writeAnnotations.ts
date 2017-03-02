import * as fs from"fs"
import {IAnnotation} from "../../models/db/Annotation";
import java = require('java');
import {PdfCache} from "../../models/common/PdfCache";

java.classpath.push('./bin/resources/PdfAnnotationsWriter.jar');

/**
 * Write provided annotations on the provided pdf file calling Java external 'PdfAnnotationWriter'
 * @param pdfData pdf info and file buffer
 * @param annotations annotation to write
 * @param callback return errors or the new pdf file containing the annotations
 */
export const writeAnnotations = (pdfData: PdfCache, annotations: IAnnotation[], callback: (err: any, result: Buffer)=>any) => {
//    let byteArray = [];

    let tmpPdfPath = getTmpPdfFilePath(pdfData.hash);
    if (!fs.existsSync(tmpPdfPath)) {
        fs.writeFileSync(tmpPdfPath, pdfData.data);
    }

  /*  for (let i = 0; i < pdfBuffer.length; i++) {
        byteArray.push(pdfBuffer[i]);
    }*/

//    let javaByteArray = java.newArray("byte", byteArray);
    let annString = JSON.stringify(annotations);

    java.callStaticMethod(
        'it.unitn.azorzi.annotations.PdfAnnotationsWriter',
        'generatePdfWithAnnotations',
        tmpPdfPath, annString, (err, result)=> {
            return (!err) ? (callback(err, new Buffer(result))) : (callback(err, result));
        });
};

function getTmpPdfFilePath (pdfHash: string) {
    return '/tmp/' + pdfHash + '.pdf';
}