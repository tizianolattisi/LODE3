import {AnnotationData} from "./AnnotationData";

export interface TextAnnotation extends AnnotationData {
    x: number,
    y: number,
    text: string,
    color: string,
    size: number,
    angle: number
}