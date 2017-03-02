import {AnnotationDataDraw} from "./AnnotationDataDraw";

export interface CircleAnnotation extends AnnotationDataDraw {
    cx: number,
    cy: number,
    r: number
}