import {AnnotationData} from "./AnnotationData";

export interface AnnotationDataDraw extends AnnotationData {

    stroke: string,
    strokeWidth: number,
    angle: number
}