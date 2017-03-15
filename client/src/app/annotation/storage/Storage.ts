import {BaseAnnotation} from "../model/BaseAnnotation";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export abstract class Storage {

    getAnnotations: (documentId: string, sync: Date, pageNumber?: number)=>Observable<BaseAnnotation[]>;

    getAnnotation: (documentId: string, annotationUuid: string) => Observable<BaseAnnotation>;

    addAnnotation: (documentId: string, annotation: BaseAnnotation) => void;

    editAnnotation: (documentId: string, annotation: BaseAnnotation) => void;

    deleteAnnotation: (documentId: string, annotationUuid: string) => void;

    getSlides: (documentId: string)=>Observable<BaseAnnotation[]>;

    onEvent: () => Subject<StorageOperation>;
}


export interface StorageOperation {

    operation: string,
    annotations: BaseAnnotation[]
}

export const StorageOpType = {
    close: 'close',
    error: 'error',
    get: 'get',
    deleteFail: 'deleteFail',
    addFail: 'addFail',
    editFail: 'addFail',
};