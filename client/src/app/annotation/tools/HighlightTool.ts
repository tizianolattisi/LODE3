import {Tool, NewAnnotation} from './Tool';
import {AnnotationManager} from "../AnnotationManager";
import {HighlightAnnotation} from "../model/HighlightAnnotation";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {Subject} from "rxjs/Subject";
import {Canvas as ICanvas, Rect as IRect, Object as IObject, Group} from "fabric";

declare const fabric: any;


let am: AnnotationManager;
let eventEmitter: Subject<NewAnnotation>;

const getPointDiffs = (e: MouseEvent, canvasPoints: { x: number, y: number }) => {
  return {
    x: e.clientX - canvasPoints.x,
    y: e.clientY - canvasPoints.y,
  }
};

const rectsIntesect = (r1: any, r2: any): boolean => {
  return !(r2.left > r1.right ||
  r2.right < r1.left ||
  (r2.top + 5 ) > (r1.bottom - 5) ||
  (r2.bottom - 5) < (r1.top + 5));
};

const maxRect = (r1: any, r2: any): any => {
  let r: any = {};
  r.left = Math.min(r1.left, r2.left);
  r.right = Math.max(r1.right, r2.right);
  r.top = Math.min(r1.top, r2.top);
  r.bottom = Math.max(r1.bottom, r2.bottom);
  r.height = r.bottom - r.top;
  r.width = r.right - r.left;
  return r;
};

export class HighlightTool implements Tool {

  public static TYPE = 'highlight';

  onAnnotationManagerProvided(annotationManager: AnnotationManager) {
    am = annotationManager;
  }

  toolSelected() {
    am.setCurrentColor('#FFC107');
    eventEmitter = new Subject<NewAnnotation>();
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

    let e: MouseEvent = event as any;
    // on mouse up handler

    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let selectionRects = range.getClientRects();
    if (selection.type == 'Range') {
      let page = parseInt(this.parentElement.getAttribute('data-page-number'));
      let canvas: ICanvas = (<any>am).canvases[page];

      if (canvas && selectionRects.length != 0) {
        let sr: any[] = [];

        for (let i = 0; i < selectionRects.length; i++) {
          sr.push(selectionRects.item(i));
        }
        for (let i = 0; i < sr.length; i++) {
          if (sr[i]) {
            for (let j = i + 1; j < sr.length; j++) {
              if (sr[j] && rectsIntesect(sr[i], sr[j])) {
                sr[i] = maxRect(sr[i], sr[j]);
                sr[j] = null;
              }
            }
          }
        }

        let rects = [];
        for (let i = 0; i < sr.length; i++) {
          if (sr[i]) {
            let r = sr[i];

            let diffs = getPointDiffs(e, canvas.getPointer(e));
            let rect = new fabric.Rect({
              left: r.left - diffs.x,
              top: r.top - diffs.y,
              width: r.width,
              height: r.height,
              fill: am.getCurrentColor(),
              opacity: 0.5,
              selectable: false
            });
            rects.push(rect);
          }
        }
        let canvasObjects: Group = new fabric.Group(rects, {selectable: false});
        canvas.add(canvasObjects);

        if (canvasObjects.getObjects().length != 0) {
          let annotation = HighlightTool.createAnnotation(canvasObjects, am.getCurrentColor());
          eventEmitter.next({
            pageNumber: page,
            canvasAnnotation: canvasObjects,
            annotationData: annotation
          });
        }
      }
    }
  };


  getType() {
    return HighlightTool.TYPE;
  };

  onAnnotationReady() {
    return eventEmitter.asObservable();
  }

  drawItem(annotation: BaseAnnotation): IObject {
    let data: HighlightAnnotation = <HighlightAnnotation>annotation.data;
    let objs: IObject[] = [];

    for (let r of data.rects) {
      objs.push(new fabric.Rect({
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        fill: data.fill,
        opacity: 0.5,
        selectable: false
      }));
    }

    return new fabric.Group(objs, {selectable: false});
  };

  editItem(object: IObject, annotation: BaseAnnotation) {
    return annotation;
  }

  onScale(object: IObject): IObject {
    return object;
  }

  static createAnnotation(rects: Group, fill: string): HighlightAnnotation {

    let rs: any[] = [];

    for (let r of rects.getObjects()) {
      rs.push({
        x: r.getLeft(),
        y: r.getTop(),
        w: r.getWidth(),
        h: r.getHeight()
      });
    }

    return {
      fill: fill,
      rects: rs
    };
  }

}
