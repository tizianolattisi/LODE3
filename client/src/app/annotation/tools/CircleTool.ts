import {Tool, NewAnnotation} from './Tool';
import {CircleAnnotation} from "../model/CircleAnnotation";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {Subject} from "rxjs/Subject";
import {AnnotationManager} from "../AnnotationManager";
import {Canvas as ICanvas, Circle as ICircle, Object as IObject} from "fabric";

declare var fabric:any;


let elem: ICircle = null;
let am: AnnotationManager;

let startX: number;
let startY: number;
let eventEmitter: Subject<NewAnnotation>;

export class CircleTool implements Tool {

    public static TYPE = 'circle';

    onAnnotationManagerProvided(annotationManager: AnnotationManager) {
        am = annotationManager;
    }

    toolSelected() {
        elem = null;
        eventEmitter = new Subject<NewAnnotation>();
    };

    toolDeselected() {
        eventEmitter.complete();
        eventEmitter = null;
    };

    onDragStart = function (event: fabric.IEvent) {

        if (event.target && event.target.selectable) {
            return;
        }

        let startPoint = (<ICanvas>this).getPointer(event.e);
        startX = startPoint.x;
        startY = startPoint.y;

        elem = new fabric.Circle({
            left: startX,
            top: startY,
            radius: 0,
            fill: 'transparent',
            stroke: (am.getCurrentColor()) ? (am.getCurrentColor()) : ('#212121'),
            strokeWidth: (am.getCurrentStrokeWidth()) ? (am.getCurrentStrokeWidth()) : (3),
            originX: 'center',
            originY: 'center',
            lockUniScaling: true,
        });
        elem.setControlsVisibility({
            mtr: false
        });


        this.add(elem);
    };

    onDragMove = function (event: fabric.IEvent) {
        if (elem) {
            let x = (<ICanvas>this).getPointer(event.e).x;
            elem.set({radius: Math.abs(startX - x)});
            this.renderAll();
        }
    };

    onDragStop = function (event: fabric.IEvent) {
        if (elem) {
            let circleAnnotation: CircleAnnotation = CircleTool.createAnnotation(elem);
            let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));

            eventEmitter.next({
                pageNumber: pageNumber,
                annotationData: circleAnnotation,
                canvasAnnotation: elem
            });

            elem = null;
        }
    };

    getType() {
        return CircleTool.TYPE;
    };

    onAnnotationReady() {
        return eventEmitter.asObservable();
    }

    drawItem(annotation: BaseAnnotation): IObject {

        let data: CircleAnnotation = <CircleAnnotation>annotation.data;
        let c = new fabric.Circle({
            left: data.cx,
            top: data.cy,
            radius: data.r,
            fill: 'transparent',
            stroke: data.stroke,
            strokeWidth: data.strokeWidth,
            angle: data.angle,
            originX: 'center',
            originY: 'center',
            lockUniScaling: true,
        });
        c.setControlsVisibility({
            mtr: false
        });
        return c;
    };

    editItem(object: IObject, annotation: BaseAnnotation) {
        (<CircleAnnotation>annotation.data).angle = object.getAngle();
        (<CircleAnnotation>annotation.data).cx = object.getLeft() * am.getScaleValue();
        (<CircleAnnotation>annotation.data).cy = object.getTop() * am.getScaleValue();

        let r = (object.getScaleX() * (<CircleAnnotation>annotation.data).r * am.getScaleValue());
        (<CircleAnnotation>annotation.data).r = r;
        (<ICircle>object).setRadius(r);
        object.setScaleX(1);
        object.setScaleY(1);
        return annotation;
    }

    static createAnnotation(elem: ICircle): CircleAnnotation {
        return {
            cx: elem.getLeft() * am.getScaleValue(),
            cy: elem.getTop() * am.getScaleValue(),
            r: elem.radius * am.getScaleValue(),
            stroke: elem.stroke,
            strokeWidth: elem.strokeWidth * am.getScaleValue(),
            angle: elem.angle
        };
    }
}
