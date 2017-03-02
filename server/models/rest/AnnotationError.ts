import {IAnnotation} from "../db/Annotation";

export interface AnnotationError {
    operation: AnnotationOperation,
    annotation: IAnnotation
}

type AnnotationOperation = 'add' | 'edit' | 'delete' | 'auth' | 'error';