import {BaseAnnotation} from "../model/BaseAnnotation";
import {Storage, StorageOperation} from "./Storage";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export default class LocalStorage implements Storage {

    getAnnotations(documentId: string, sync: Date, pageNumber?: number) {
        let annotationsString = localStorage.getItem(documentId);
        let annotations: BaseAnnotation[] = (annotationsString != null ) ? (JSON.parse(annotationsString)) : ([]);

        if (!pageNumber) {
            return Observable.of(annotations);
        } else {
            let response: BaseAnnotation[] = [];
            for (let ann of annotations) {
                if (ann.pageNumber == pageNumber) {
                    response.push(ann);
                }
            }
            return Observable.of(response);
        }
    };

    getAnnotation(documentId: string, annotationUuid: string) {
        let annotationsString = localStorage.getItem(documentId);
        let annotations: BaseAnnotation[] = (annotationsString != null ) ? (JSON.parse(annotationsString)) : ([]);
        for (let ann of  annotations) {
            if (ann.uuid === annotationUuid) {
                return Observable.of(ann);
            }
        }
        return Observable.of(null);
    };

    addAnnotation(documentId: string, annotation: BaseAnnotation) {
        let annotationsString = localStorage.getItem(documentId);
        let annotations: BaseAnnotation[] = (annotationsString != null ) ? (JSON.parse(annotationsString)) : ([]);
        annotations.push(annotation);
        localStorage.setItem(documentId, JSON.stringify(annotations));
    };

    editAnnotation(documentId: string, annotation: BaseAnnotation) {
        let annotationsString = localStorage.getItem(documentId);
        let annotations: BaseAnnotation[] = (annotationsString != null ) ? (JSON.parse(annotationsString)) : ([]);
        for (let i in annotations) {
            if (annotations[i].uuid === annotation.uuid) {
                annotations[i] = annotation;
                localStorage.setItem(documentId, JSON.stringify(annotations));
                break;
            }
        }
    };

    deleteAnnotation(documentId: string, annotationUuid: string) {
        let annotationsString = localStorage.getItem(documentId);
        let annotations: BaseAnnotation[] = (annotationsString != null ) ? (JSON.parse(annotationsString)) : ([]);
        for (let i in  annotations) {
            if (annotations[i].uuid === annotationUuid) {
                annotations.splice(parseInt(i), 1);
                localStorage.setItem(documentId, JSON.stringify(annotations));
                break;
            }
        }
    };

    onEvent(): Subject<StorageOperation> {
        return null;
    }
}