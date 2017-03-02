import {AnnotationData} from "./AnnotationData";

export interface BaseAnnotation {

    uuid: string,
    pdfId?: string,
    pageNumber: number,
    type: string,
    data: AnnotationData,
    time?: number
    timestamp?: Date
}