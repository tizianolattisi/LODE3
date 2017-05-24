import {BaseAnnotation} from "../model/BaseAnnotation";
import {AnnotationManager} from "../AnnotationManager";
import {IEvent, Object as IObject} from "fabric";
import {AnnotationData} from "../model/AnnotationData";
import {Observable} from "rxjs/Observable";


/**
 * A tool for insert annotations into the pdf document.
 * It is responsible also for create new annotations.
 */
export interface Tool {

    toolSelected: () => void;
    toolDeselected: () => void;
    onAnnotationManagerProvided: (annotationManager: AnnotationManager) => void;

    // handlers
    onDragStart: (event: IEvent) => void;
    onDragMove: (event: IEvent) => void;
    onDragStop: (event: IEvent) => void;

    getType: () => string;
    onAnnotationReady: () => Observable<NewAnnotation>

    /**
     * Given an annotation, return the FabricJS graphical model
     * @param annotation the annotation which should be rendered
     * @return object model
     */
    drawItem: (annotation: BaseAnnotation) => IObject;

    /**
     * Given the new object and the annotation, return the edited annotation.
     * @param object the edited object
     * @param annotation edited annotation or null if it should be deleted
     */
    editItem: (object: IObject, annotation: BaseAnnotation) => BaseAnnotation;

  /**
   * Function called when object or pdf is resized.
   * @param object Canvas object.
   */
    onScale: (object: IObject) => IObject;
}

export interface NewAnnotation {
    pageNumber: number,
    annotationData: AnnotationData,
    canvasAnnotation: IObject,
}
