import {AnnotationData} from "./AnnotationData";

export interface HighlightAnnotation extends AnnotationData {
    fill: string,
    rects: RectData[],
}

interface RectData {
    x: number,
    y: number,
    w: number,
    h: number
}