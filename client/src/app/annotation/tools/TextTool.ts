import {Tool, NewAnnotation} from './Tool';
import {AnnotationManager} from "../AnnotationManager";
import {TextAnnotation} from "../model/TextAnnotation";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {Subject} from "rxjs/Subject";
import {Object as IObject, Canvas as ICanvas} from "fabric";

declare var fabric:any;

let am: AnnotationManager;
let eventEmitter: Subject<NewAnnotation>;


export class TextTool implements Tool {

    public static TYPE = 'text';

    onAnnotationManagerProvided(annotationManager: AnnotationManager) {
        am = annotationManager;
    }

    toolSelected() {
        eventEmitter = new Subject<NewAnnotation>();
        if (am.getCurrentStrokeWidth() < 16) {
            am.setCurrentStrokeWidth(16);
        }
    };

    toolDeselected() {
        eventEmitter.complete();
        eventEmitter = null;
    };

    onDragStart = function (event: fabric.IEvent) {

    };

    onDragMove = function (event: fabric.IEvent) {

    };

    onDragStop = function (event: fabric.IEvent) {

        let text = prompt("Insert some text", "text");

        if (!text) {
            return;
        }

        let point = (<ICanvas>this).getPointer(event.e);

        let textElem = new fabric.Text(text, {
            left: point.x,
            top: point.y,
            fontFamily: 'Lato',
            fontSize: am.getCurrentStrokeWidth(),
            fill: am.getCurrentColor(),
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true
        });


        let annotation: TextAnnotation = {
            x: point.x * am.getScaleValue(),
            y: point.y * am.getScaleValue(),
            text: text,
            color: am.getCurrentColor(),
            size: am.getCurrentStrokeWidth() * am.getScaleValue(),
            angle: 0
        };

        this.add(textElem);

        let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));
        eventEmitter.next({
            pageNumber: pageNumber,
            annotationData: annotation,
            canvasAnnotation: textElem
        });

        am.terminateToolSession();
    };

    getType() {
        return TextTool.TYPE;
    };

    onAnnotationReady() {
        return eventEmitter.asObservable();
    }

    drawItem(annotation: BaseAnnotation): IObject {

        let data: TextAnnotation = <TextAnnotation>annotation.data;
        return new fabric.Text(data.text, {
            left: data.x,
            top: data.y,
            fontFamily: 'Lato',
            fontSize: data.size,
            fill: data.color,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            angle: data.angle
        });
    }

    editItem(object: IObject, annotation: BaseAnnotation) {
        (<TextAnnotation>annotation.data).angle = object.getAngle();
        (<TextAnnotation>annotation.data).x = object.getLeft() * am.getScaleValue();
        (<TextAnnotation>annotation.data).y = object.getTop() * am.getScaleValue();
        return annotation;
    }
}
