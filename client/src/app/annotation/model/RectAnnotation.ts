import {AnnotationDataDraw} from "./AnnotationDataDraw";

export interface RectAnnotation extends AnnotationDataDraw {
    x: number,
    y: number,
    w: number,
    h: number
}