import {Tool, NewAnnotation} from './Tool';
import {AnnotationManager} from "../AnnotationManager";
import {RectAnnotation} from "../model/RectAnnotation";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {Subject} from "rxjs/Subject";
import {Rect as IRect, Object as IObject, Canvas as ICanvas} from "fabric";

declare var fabric:any;

let elem: IRect = null;
let am: AnnotationManager;

let startX: number;
let startY: number;
let eventEmitter: Subject<NewAnnotation>;

export class RectTool implements Tool {

    public static TYPE = 'rect';

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

        elem = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: (am.getCurrentColor()) ? (am.getCurrentColor()) : ('#212121'),
            strokeWidth: (am.getCurrentStrokeWidth()) ? (am.getCurrentStrokeWidth()) : (3)
        });

        this.add(elem);
    };

    onDragMove = function (event: fabric.IEvent) {
        if (elem) {
            let point = (<ICanvas>this).getPointer(event.e);
            elem.set('width', (point.x - startX));
            elem.set('height', (point.y - startY));
            elem.setCoords();
            this.renderAll();
        }
    };

    onDragStop = function (event: fabric.IEvent) {
        if (elem) {
            let rectAnnotation: RectAnnotation = RectTool.createAnnotation(elem);
            let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));

            eventEmitter.next({
                pageNumber: pageNumber,
                annotationData: rectAnnotation,
                canvasAnnotation: elem
            });

            elem = null;
        }
    };

    getType() {
        return RectTool.TYPE;
    };

    onAnnotationReady() {
        return eventEmitter.asObservable();
    }

    drawItem(annotation: BaseAnnotation): IObject {

        let data: RectAnnotation = <RectAnnotation> annotation.data;
        return new fabric.Rect({
            left: data.x,
            top: data.y,
            width: data.w,
            height: data.h,
            fill: 'transparent',
            stroke: data.stroke,
            strokeWidth: data.strokeWidth,
            angle: data.angle
        });
    };

    editItem(object: IObject, annotation: BaseAnnotation) {
        (<RectAnnotation>annotation.data).angle = object.getAngle();
        (<RectAnnotation>annotation.data).x = object.getLeft() * am.getScaleValue();
        (<RectAnnotation>annotation.data).y = object.getTop() * am.getScaleValue();

        let w = object.getScaleX() * (<RectAnnotation>annotation.data).w * am.getScaleValue();
        let h = object.getScaleY() * (<RectAnnotation>annotation.data).h * am.getScaleValue();
        (<RectAnnotation>annotation.data).w = w;
        object.setWidth(w);
        object.setScaleX(1);
        (<RectAnnotation>annotation.data).h = h;
        object.setHeight(h);
        object.setScaleY(1);
        return annotation;
    }


    static createAnnotation(elem: IRect): RectAnnotation {
        return {
            x: elem.getLeft() * am.getScaleValue(),
            y: elem.getTop() * am.getScaleValue(),
            w: elem.getWidth() * am.getScaleValue(),
            h: elem.getHeight() * am.getScaleValue(),
            stroke: elem.stroke,
            strokeWidth: elem.strokeWidth * am.getScaleValue(),
            angle: elem.angle
        };
    }
}
