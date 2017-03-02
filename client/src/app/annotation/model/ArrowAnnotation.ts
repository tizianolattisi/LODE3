import {AnnotationDataDraw} from "./AnnotationDataDraw";

export interface ArrowAnnotation extends AnnotationDataDraw {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}