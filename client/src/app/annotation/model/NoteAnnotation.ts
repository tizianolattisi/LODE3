import {AnnotationData} from "./AnnotationData";
import {DeltaStatic} from "quill";

export interface NoteAnnotation extends AnnotationData {
    x: number,
    y: number,
    title: string,
    text: DeltaStatic
}
