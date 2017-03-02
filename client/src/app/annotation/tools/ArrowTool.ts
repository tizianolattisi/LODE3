import {Tool, NewAnnotation} from "./Tool";
import {ArrowAnnotation} from "../model/ArrowAnnotation";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {Canvas as ICanvas, Line as ILine, Object as IObject} from "fabric";
declare var fabric:any;

import {Subject} from "rxjs/Subject";
import {AnnotationManager} from "../AnnotationManager";

let elem: ILine = null;
let am: AnnotationManager;

let eventEmitter: Subject<NewAnnotation>;

export class ArrowTool implements Tool {

    public static TYPE = 'arrow';

    constructor() {
        createFabricLineArrow();
    }

    onAnnotationManagerProvided(annotationManager: AnnotationManager) {
        am = annotationManager;
    }

    toolSelected() {
        elem = null;
        eventEmitter = new Subject<NewAnnotation>();
    }

    toolDeselected() {
        eventEmitter.complete();
        eventEmitter = null;
    }

    onDragStart = function (event: fabric.IEvent) {

        if (event.target && event.target.selectable) {
            return;
        }

        let point = (<ICanvas>this).getPointer(event.e);

        elem = new (<any>fabric).LineArrow([point.x, point.y, point.x + 1, point.y + 1]);
        elem.set({
            stroke: am.getCurrentColor(),
            strokeWidth: am.getCurrentStrokeWidth(),
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true
        });
        elem.setControlsVisibility({
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mt: false,
            mb: false,
            mr: false,
            ml: false
        });

        this.add(elem);
    };


    onDragMove = function (event: fabric.IEvent) {
        if (elem) {

            let point = (<ICanvas>this).getPointer(event.e);

            elem.set({
                x2: (point.x),
                y2: (point.y)
            });
            this.renderAll();
        }
    };

    onDragStop = function (event: fabric.IEvent) {
        if (elem) {
            let annotation = ArrowTool.createAnnotation(elem);
            let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));

            eventEmitter.next({
                pageNumber: pageNumber,
                annotationData: annotation,
                canvasAnnotation: elem
            });
            elem = null;
        }
    };


    getType() {
        return ArrowTool.TYPE;
    };

    onAnnotationReady() {
        return eventEmitter.asObservable();
    }

    drawItem(annotation: BaseAnnotation): IObject {

        let data: ArrowAnnotation = <ArrowAnnotation>annotation.data;
        let arrow = new (<any>fabric).LineArrow([data.x1, data.y1, data.x2, data.y2]);
        arrow.set({
            stroke: data.stroke,
            strokeWidth: data.strokeWidth,
            angle: data.angle,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true
        });
        arrow.setControlsVisibility({
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mt: false,
            mb: false,
            mr: false,
            ml: false
        });

        return arrow;
    };

    editItem(object: ILine, annotation: BaseAnnotation) {
        (<ArrowAnnotation>annotation.data).angle = object.getAngle();

        let dx = object.getLeft() - ((object.x1 < object.x2) ? (object.x1) : (object.x2));
        let dy = object.getTop() - ((object.y1 < object.y2) ? (object.y1) : (object.y2));

        object.set({
            x1: object.x1 + dx,
            y1: object.y1 + dy,
            x2: object.x2 + dx,
            y2: object.y2 + dy
        });
        object.set({
            left: (object.x1 < object.x2) ? (object.x1) : (object.x2),
            top: (object.y1 < object.y2) ? (object.y1) : (object.y2)
        });

        (<ArrowAnnotation>annotation.data).x1 = object.x1 * am.getScaleValue();
        (<ArrowAnnotation>annotation.data).y1 = object.y1 * am.getScaleValue();
        (<ArrowAnnotation>annotation.data).x2 = object.x2 * am.getScaleValue();
        (<ArrowAnnotation>annotation.data).y2 = object.y2 * am.getScaleValue();
        return annotation;
    }

    private static createAnnotation(elem: ILine): ArrowAnnotation {
        return {
            x1: elem.x1 * am.getScaleValue(),
            y1: elem.y1 * am.getScaleValue(),
            x2: elem.x2 * am.getScaleValue(),
            y2: elem.y2 * am.getScaleValue(),
            stroke: elem.stroke,
            strokeWidth: elem.strokeWidth * am.getScaleValue(),
            angle: elem.angle
        };
    }
}


const createFabricLineArrow = () => {

    // see: https://groups.google.com/forum/#!topic/fabricjs/x8YBObF9zO4

    (<any>fabric).LineArrow = fabric.util.createClass(fabric.Line, {

        type: 'lineArrow',

        initialize: function (element: any, options: any) {
            options || (options = {});
            this.callSuper('initialize', element, options);
        },

        toObject: function () {
            return (<any>fabric).util.object.extend(this.callSuper('toObject'));
        },

        _render: function (ctx: any) {
            this.callSuper('_render', ctx);

            // do not render if width/height are zeros or object is not visible
            if (this.width === 0 || this.height === 0 || !this.visible) return;

            ctx.save();

            var xDiff = this.x2 - this.x1;
            var yDiff = this.y2 - this.y1;
            var angle = Math.atan2(yDiff, xDiff);
            ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-15, 12);
            ctx.lineTo(-15, -12);
            ctx.closePath();
            ctx.fillStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    });

    (<any>fabric).LineArrow.fromObject = function (object: ILine, callback: any) {
        callback && callback(new (<any>fabric).LineArrow([object.x1, object.y1, object.x2, object.y2], object));
    };

    (<any>fabric).LineArrow.async = true;
};
