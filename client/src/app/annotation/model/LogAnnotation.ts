import {AnnotationDataLog} from "./AnnotationDataLog";

export interface LogAnnotation extends AnnotationDataLog {
    type: string,
    action: string,
    value: number
}
