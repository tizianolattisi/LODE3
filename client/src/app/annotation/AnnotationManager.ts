import {Storage, StorageOperation, StorageOpType} from "./storage/Storage";
import {ToolAndUI} from "./utils/ToolAndUI";
import {Tool, NewAnnotation} from "./tools/Tool";
import {HighlightTool} from "./tools/HighlightTool";
import {BaseAnnotation} from "./model/BaseAnnotation";
import {Injectable, Inject} from "@angular/core";
import {NoteTool} from "./tools/NoteTool";
import {generateUUID, STORAGE_OPAQUE_TOKEN} from "./utils/Utils";
import {PencilTool} from "./tools/PencilTool";
import {PencilAnnotation} from "./model/PencilAnnotation";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {NoteManager} from "./NoteManager";
import {NoteAnnotation} from "./model/NoteAnnotation";
import {StoreService} from "../shared/store.service";
import {Router} from "@angular/router";
import {AnnotationToolbarComponent} from "../editor/annotation-toolbar/annotation-toolbar.component";
import {StaticCanvas as IStaticCanvas,Canvas as ICanvas, Object as IObject, IEvent as IEvent, Group as IGroup} from "fabric";
import DeltaStatic = Quill.DeltaStatic;
import {ToolService} from "./tool.service";
import {LogManager} from "./LogManager";
import {LogAnnotation} from "./model/LogAnnotation";

declare var fabric:any;

/**
 * Object responsible of all the annotations stuff on the PDF document
 * It initialize also the Annotation toolbar
 */
@Injectable()
export class AnnotationManager implements NoteManager, LogManager {

    static DEFAULT_TOOL_TYPE: string = 'default';

    static CANVAS_PAGE_NUMBER = 'data-page-number';
    static ELEM_UUID = 'uuid';
    static ELEM_PAGE = 'page';
    static PATH_N = 'path-n';

    /* -----
     * Variables
     ----- */

    public isEditorMode: boolean = true;

    protected pdfViewer: any;
    protected documentId: string;

    protected allAnnotationsLoaded: boolean = false;
    protected videoStartDate: Date = null;

    protected _allAnnotations: BehaviorSubject<{[type: string]: BaseAnnotation}[]> = new BehaviorSubject([]);
    allAnnotations: Observable<{[type: string]: BaseAnnotation}[]> = this._allAnnotations.asObservable();

    protected _annotationTools: BehaviorSubject<{[type: string]: ToolAndUI}> = new BehaviorSubject({} as {[type: string]: ToolAndUI});
    annotationTools: Observable<{[type: string]: ToolAndUI}> = this._annotationTools.asObservable();

    // open notes
    protected _openNotesUuid: BehaviorSubject<string[]> = new BehaviorSubject([]);
    openNotesUuid: Observable<string[]> = this._openNotesUuid.asObservable();
    openNotesPageNumber: number[] = [];
    openNotesEditMode: boolean[] = [];
    protected _highlightedNote: BehaviorSubject<string> = new BehaviorSubject('');
    highlightedNote: Observable<string> = this._highlightedNote.asObservable();

    protected canvases: ICanvas[] = [];
    protected currentCanvas: IStaticCanvas = null;

    // messages that should be displayed to user when something goes wrong (get annotations fail, save annotations fail, ...)
    public errorMessage: string = '';

    _toolSelected: BehaviorSubject<string> = new BehaviorSubject(AnnotationManager.DEFAULT_TOOL_TYPE);
    toolSelected: Observable<string> = this._toolSelected.asObservable();

    // listen from new annotations coming from tools
    private onNewAnnotationFromTool: Observable<NewAnnotation>;

    private annotationToolbar: AnnotationToolbarComponent;

    public currentColor: string = "#212121";
    public currentStrokeWidth: number = 3;
    public isTextSelectionMode: boolean = false;

    constructor(private toolService: ToolService, @Inject(STORAGE_OPAQUE_TOKEN) private storage: Storage, private storeService: StoreService, private router: Router) {

      // set editor mode
        this.router.events.subscribe((event) => {
            if (this.router.url == '/editor') {
                this.isEditorMode = true;
                this.currentCanvas = null;
            } else if (this.router.url == '/video') {
                this.isEditorMode = false;
                this.canvases = [];
                if (!this.allAnnotationsLoaded && this.videoStartDate) {
                    this.loadAllAnnotations();
                }
            }
        });

        this.init();
        this.initTools();
        this.initFabric();
        this.initStorage();

        this.storeService.lodeLecture.subscribe(lodeLecture => { // load all annotations
            if (lodeLecture) {
                this.videoStartDate = lodeLecture.video.start;
                if (!this.isEditorMode && !this.allAnnotationsLoaded) {
                    this.loadAllAnnotations();
                }
            }
        });
    }

    private loadAllAnnotations() {
        this._allAnnotations.next([]); // remove previous annotations that will be reloaded
        this.storage.getAnnotations(this.storeService.pdfHash, this.videoStartDate);
        this.allAnnotationsLoaded = true;
    }

    /* -----
     * Initialization Functions
     ----- */

    protected init() {
        this.storeService.pdfViewer.subscribe(pdfViewer => {
            if (pdfViewer) {
                this.pdfViewer = pdfViewer;
                /*
                 * Listen for page rendering and add the annotation svg layer.
                 * Event 'pagerendered' is fired from PDFViewer when a new page is rendered
                 * or the scale is changed (in this case, each page is rendered again)
                 */
                pdfViewer.container.addEventListener('pagerendered', (e: any) => {
                    this.addFCanvas(e.detail.pageNumber);
                });

                // console.log("Annotation Layer: Preparing for new document " + this.storeService.pdfHash);
                this.documentId = this.storeService.pdfHash;

                this.canvases = [];
                this.currentCanvas = null;

                this._openNotesUuid.next([]);
                this.openNotesPageNumber = [];
                this.openNotesEditMode = [];
            }
        });
    }

    protected initTools() {
        let annotationsTools = this.toolService.getTools();
        // Initialize the annotation tools and the related user interface
        for (let key of Object.keys(annotationsTools)) {
            annotationsTools[key].tool.onAnnotationManagerProvided(this);
        }
        this._annotationTools.next(annotationsTools);
    }

    protected initFabric() {
        // customize annotations editing handlers
        fabric.Object.prototype.borderColor = 'rgb(5, 168, 255)';
        fabric.Object.prototype.cornerColor = 'rgb(5, 168, 255)';
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerSize = 8;
        fabric.Object.prototype.rotatingPointOffset = 20;
        fabric.Object.prototype.padding = 2;
    }

    private initStorage() {
        let storageEmitter = this.storage.onEvent();
        if (storageEmitter) {
            storageEmitter.subscribe((res: StorageOperation) => {
                switch (res.operation) {

                    case StorageOpType.get:
                        for (let ann of res.annotations) {
                            this.addAnnotationToCanvas(this.canvases[ann.pageNumber], ann);
                            this.addToAllAnnotations(ann);
                        }
                        this._allAnnotations.next(this._allAnnotations.getValue());
                        break;
                    case StorageOpType.addFail:
                        if (res.annotations[0]) {
                            this.deleteAnnotation(res.annotations[0].uuid, res.annotations[0].pageNumber, true);
                        }
                        this.showTempErrMessage('Fail to save the last annotation. Please, try to refresh the page.');
                        break;

                    case StorageOpType.deleteFail:
                        this.showTempErrMessage('Fail to delete the last annotation. Please, try to refresh the page.');
                        break;

                    case StorageOpType.editFail:
                        if (res.annotations[0]) {
                            this.deleteAnnotation(res.annotations[0].uuid, res.annotations[0].pageNumber, true);
                            this.addAnnotationToCanvas(this.canvases[res.annotations[0].pageNumber], res.annotations[0]);
                        }
                        this.showTempErrMessage('Fail to save last edited annotation. Please, try to refresh the page.');
                        break;

                    case StorageOpType.close:
                        setTimeout(()=> {
                            this.errorMessage = 'Attention! It\'s possible that future annotations will not be saved. Please, try to refresh the page.';
                        }, 3000);
                        break;
                }
            });
        }
    }

    /**
     * Register a AnnotationToolbar which tools can use to get colors and stroke
     * @param annotationToolbar the annotation toolbar
     */
    registerAnnotationToolbar(annotationToolbar: AnnotationToolbarComponent) {
        this.annotationToolbar = annotationToolbar;
    }

    /* -----
     * Canvas Management
     ----- */

    /**
     * Substitute the canvas content created by PDFViewer with a editable canvas of FabricJS.
     * If the canvas has already been substituted (thus some annotations are already been drawn)
     * (because pdf page is not new but only re-rendered), re-add the the editable canvas and reload the annotations.
     * @param pageNumber page number
     */
    protected addFCanvas(pageNumber: number): ICanvas | IStaticCanvas {

        let fCanvas = this.createCanvas(pageNumber, !this.isEditorMode);
        if (!fCanvas) {
          return null;
        }

        if (this.isEditorMode) {
            this.canvases[pageNumber] = <ICanvas>fCanvas;
            this.updateCanvasForTool(<ICanvas>fCanvas, this._toolSelected.getValue());
            this.setCanvasSelectionHandlers(<ICanvas>fCanvas);
            this.setCanvasObjectEditingHandlers(<ICanvas>fCanvas);
        } else {
            this.currentCanvas = fCanvas;
        }

        if (this._allAnnotations.getValue()[pageNumber]) { // annotations already loaded
            // console.log("Canvas: appending to page " + pageNumber);

            for (let ann of this.objectToArray(this._allAnnotations.getValue()[pageNumber])) {
                this.addAnnotationToCanvas(<ICanvas>fCanvas, ann);
            }
        } else { // new page added
            if (this.isEditorMode) {
                // console.log("Canvas: adding to new page " + pageNumber);
                // fetch annotation from storage
                this.storage.getAnnotations(this.documentId, null, pageNumber);
            }
        }
        return fCanvas;
    };

    protected createCanvas(pageNumber: number, staticCanvas: boolean): ICanvas | IStaticCanvas {
        // add editable canvas on top of the pdfjs canvas

        let container = (this.isEditorMode) ? (document.getElementById('pageContainer' + pageNumber)) : (document.getElementById('slide-container'));
        if (container) {
          let c = document.createElement('canvas');
          container.appendChild(c);

          let fCanvas = (staticCanvas) ? (new fabric.StaticCanvas(c)) : (new fabric.Canvas(c));
          fCanvas.getElement().setAttribute(AnnotationManager.CANVAS_PAGE_NUMBER, pageNumber.toString());

          fCanvas.setWidth(container.getBoundingClientRect().width);
          fCanvas.setHeight(container.getBoundingClientRect().height);
          fCanvas.calcOffset();
          return fCanvas;
        } else {
          console.warn('No canvas has been added to slides because slide container is missing');
          return null;
        }
    }

    private getCanvasElemById(canvas: ICanvas, uuid: string): IObject | IObject[] {
        if (canvas) {
            let res: IObject[] = [];
            let objs = canvas.getObjects();
            for (let obj of  objs) {
                if (obj.get(AnnotationManager.ELEM_UUID) == uuid) {
                    res.push(obj);
                }
            }
            return (res.length == 1) ? (res[0]) : (res);
        }
        return null;
    }


    /* -----
     * Annotations management
     ----- */

    /**
     * Render an annotation to canvas without save it.
     * @param canvas
     * @param annotation
     */
    protected addAnnotationToCanvas(canvas: ICanvas, annotation: BaseAnnotation): void {

        let tool = this._annotationTools.getValue()[annotation.type];

        if (tool && canvas) {
            let canvasAnnotation = tool.tool.drawItem(annotation);
            if (canvasAnnotation) {

                this.setCanvasObjectProperties(canvasAnnotation, annotation.uuid, annotation.type, annotation.pageNumber);

                if (canvasAnnotation.constructor === Array) {
                    for (let o of <IObject[]>canvasAnnotation) {
                        this.scaleObject(o);
                        canvas.add(o);
                    }
                } else {
                    this.scaleObject(<IObject>canvasAnnotation);
                    canvas.add(<any>canvasAnnotation);
                }
            } else {
                // console.error("Error while drawing " + annotation.type + " " + annotation.uuid);
            }
        } else {
            // console.error("Trying to load an unrecognized annotation of type " + annotation.type + " or missing canvas.");
        }
    }

    setCanvasObjectProperties(object: IObject | IObject[], uuid: string, type: string, pageNumber: number) {
      if (object) {
        if (object.constructor === Array) {
          for (let i in <IObject[]>object) { // is a path
            object[i].set(AnnotationManager.ELEM_UUID, uuid);
            object[i].set(AnnotationManager.ELEM_PAGE, pageNumber);
            object[i].set(AnnotationManager.PATH_N, i);
          }
        } else {
          (<IObject>object).set(AnnotationManager.ELEM_UUID, uuid);
          (<IObject>object).set(AnnotationManager.ELEM_PAGE, pageNumber);
        }

        if (type == NoteTool.TYPE) { // open note on click
          (<IObject>object).on('mouseup', (event: IEvent) => {
            this.openNote(uuid, pageNumber, true);
          });
        }
      }
    }

    /**
     * Save an annotation created by a tool
     * @param type
     * @param pageNumber
     * @param newAnnotation
     */
    saveNewAnnotation(type: string, pageNumber: number, newAnnotation: NewAnnotation) {

        let annotationUuid = generateUUID();

        // set object properties
        this.setCanvasObjectProperties(newAnnotation.canvasAnnotation, annotationUuid, type, pageNumber);

        // build a new annotation
        let annotation: BaseAnnotation = {
            uuid: annotationUuid,
            type: type,
            pageNumber: pageNumber,
            data: newAnnotation.annotationData
        };

        // if available, add the video time
        let time = this.storeService.getCurrentTime();
        if (time && time > 0 && this.videoStartDate) {
            annotation.timestamp = this.getVideoDateRelativeToLesson(time, this.videoStartDate);
        }
        // save annotation in storage
        this.storage.addAnnotation(this.documentId, annotation);

        // add time relative to video
        if (time && time > 0) {
            annotation.time = time;
        }

        // add annotation to allAnnotations
        this.addToAllAnnotations(annotation);
        this._allAnnotations.next(this._allAnnotations.getValue());
    }

    /* -----
     * Tool Management
     ----- */

    selectTool(type: string) {
        if (this._toolSelected.getValue() == type) {
            return;
        }

        // console.log("Selecting tool " + type);

        if (this._toolSelected.getValue() == PencilTool.TYPE) { // disable canvas drawing mode
            for (let c of  this.canvases) {
                if (c) {
                    c.isDrawingMode = false;
                }
            }
        }

        // deselect last tool
        let tool = this.getTool(this._toolSelected.getValue());
        if (tool) {
            tool.toolDeselected();
        }
        if (this.onNewAnnotationFromTool) {
            this.onNewAnnotationFromTool = null;
        }

        // select new tool
        let oldTool = this._toolSelected.getValue();
        this._toolSelected.next(type);

        tool = this.getTool(this._toolSelected.getValue());
        if (tool) {
            tool.toolSelected();
            this.onNewAnnotationFromTool = tool.onAnnotationReady();
            if (this.onNewAnnotationFromTool) {
                // save annotations
                this.onNewAnnotationFromTool.subscribe(newAnnotation => {
                    this.saveNewAnnotation(this._toolSelected.getValue(), newAnnotation.pageNumber, newAnnotation);
                });
            }

            this.isTextSelectionMode = (type == HighlightTool.TYPE); // true if highlight tool is selected

            for (let canvas of this.canvases) {
                if (canvas) {
                    this.resetToolLayer(canvas, oldTool);
                    this.updateCanvasForTool(canvas, this._toolSelected.getValue());
                }
            }
        } else if (this._toolSelected.getValue() == AnnotationManager.DEFAULT_TOOL_TYPE) {
            for (let canvas of this.canvases) {
                if (canvas) {
                    this.resetToolLayer(canvas, oldTool);
                }
            }
        }
    };

    protected resetToolLayer(canvas: ICanvas, toolType: string) {
        let tool = this.getTool(toolType);
        if (tool != null) {
            if (toolType == HighlightTool.TYPE) {
                let textLayerElem: HTMLElement = this.getTextLayer(canvas);
                if (textLayerElem) {
                    textLayerElem.onmouseup = null;
                }
            } else {
                canvas.off('mouse:down', tool.onDragStart);
                canvas.off('mouse:move', tool.onDragMove);
                canvas.off('mouse:up', tool.onDragStop);
            }
            canvas.selection = true;
        }
    }

    protected updateCanvasForTool(canvas: ICanvas, toolType: string) {
        let tool = this.getTool(toolType);
        if (tool != null && canvas) {
            if (toolType == HighlightTool.TYPE) { // exception for highlight tool
                this.setTextSelectionMode(true);

                let textLayerElem: HTMLElement = this.getTextLayer(canvas);
                if (textLayerElem) {
                    textLayerElem.onmouseup = tool.onDragStop as any;
                }
            } else {

                if (toolType == PencilTool.TYPE) { //  exception for pencil tool
                    (<any>canvas).freeDrawingBrush.color = this.currentColor;
                    (<any>canvas).freeDrawingBrush.width = this.currentStrokeWidth;
                    canvas.isDrawingMode = true;
                }
                canvas.on('mouse:down', tool.onDragStart);
                canvas.on('mouse:move', tool.onDragMove);
                canvas.on('mouse:up', tool.onDragStop);

                canvas.selection = false;
            }
        }
        this.applyTextSelectionMode(canvas);
    };

    protected saveEditedAnnotation(object: IObject) {

        let uuid = object.get(AnnotationManager.ELEM_UUID);
        let pageNumber = object.get(AnnotationManager.ELEM_PAGE);

        let annotation = this._allAnnotations.getValue()[pageNumber][uuid];
        if (annotation) {
            let tool = this.getTool(annotation.type);
            if (tool) {
                let newA = tool.editItem(object, annotation);
                this._allAnnotations.getValue()[pageNumber][uuid] = newA;
                this.storage.editAnnotation(this.documentId, newA);
                this._allAnnotations.next(this._allAnnotations.getValue());
            }
        } else { // annotation should be deleted
            this.deleteAnnotation(uuid, pageNumber);
        }
    }

    /* -----
     * Tool Getters
     ----- */

    /**
     * Get a tool from available tools
     * @param type type of tool
     * @return {Tool} the tool or null if is not available
     */
    getTool(type: string): Tool {
        let toolUi: ToolAndUI = this._annotationTools.getValue()[type];
        if (toolUi) {
            return toolUi.tool;
        }
        return null;
    }

    setCurrentColor(hex: string): void {
        this.currentColor = hex;
    }

    setCurrentStrokeWidth(width: number): void {
        this.currentStrokeWidth = width;
    }

    getCurrentColor(): string {
        return this.currentColor;
    }

    getCurrentStrokeWidth(): number {
        return (this.currentStrokeWidth * this.getScaleValue());
    }

    terminateToolSession(): void {
        this.selectTool(AnnotationManager.DEFAULT_TOOL_TYPE);
    }


    /* -----
     * Annotations management
     ----- */

    setCanvasObjectEditingHandlers(canvas: ICanvas) {
        // add objects editing handlers
        canvas.on('object:modified', (event: IEvent) => {

            if ((event.target.get('type') == 'group') && (event.target.get('uuid') == null)) {
                for (let o of (<IGroup>event.target).getObjects()) {
                    this.saveEditedAnnotation(o);
                }
            } else {
                this.saveEditedAnnotation(event.target);
            }
        });
    }

    setCanvasSelectionHandlers(canvas: ICanvas) {
        canvas.on('selection:created', function (event: IEvent) {

            // block selections scaling -> can edit only single objects
            event.target.set({
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true
            });
        });
    }

    deleteSelectedAnnotations(): void {
        for (let canvas of this.canvases) {
            if (canvas) {
                let group = canvas.getActiveGroup();
                let activeObject = canvas.getActiveObject();
                if (group) {
                    group.forEachObject((elem)=> {
                        this.deleteAnnotationSimple(elem);
                        canvas.remove(elem);
                    });
                    canvas.discardActiveGroup();
                } else if (activeObject) {
                    this.deleteAnnotationSimple(activeObject);
                    canvas.remove(activeObject);
                }
            }
        }
        this._allAnnotations.next(this._allAnnotations.getValue());
    }

    private deleteAnnotationSimple(object: IObject) {
        let uuid = object.get(AnnotationManager.ELEM_UUID);
        let pageNumber = object.get(AnnotationManager.ELEM_PAGE);
        if (!object.get(AnnotationManager.PATH_N)) {
            this.storage.deleteAnnotation(this.documentId, uuid);
            // remove from all annotations array
            this.removeFromAllAnnotations(uuid, pageNumber);
        } else { // edit path
            let annotation = this._allAnnotations.getValue()[pageNumber][uuid];
            if ((<PencilAnnotation>annotation.data).paths.length <= 1) {
                this.storage.deleteAnnotation(this.documentId, uuid);
                this.removeFromAllAnnotations(uuid, pageNumber);
            } else {
                this.saveEditedAnnotation(object); // edit pencil annotation means only delete some paths
            }
        }
    }

    deleteAnnotation(uuid: string, pageNumber: number, notSave?: boolean): void {

        // remove from canvas
        let canvas = this.canvases[pageNumber];
        if (canvas) {
            let object = this.getCanvasElemById(canvas, uuid);
            if (object) {
                if (object.constructor === Array) {
                    for (let o of <IObject[]>object) {
                        canvas.remove(o);
                    }
                } else {
                    canvas.remove(<IObject>object);
                }
                canvas.renderAll();
            }
        }

        // delete
        if (!notSave) {
            this.storage.deleteAnnotation(this.documentId, uuid);
        }

        // remove from all annotations
        this.removeFromAllAnnotations(uuid, pageNumber);
        this._allAnnotations.next(this._allAnnotations.getValue());
    };

    private removeFromAllAnnotations(uuid: string, pageNumber?: number): void {

        if (pageNumber) {
            delete this._allAnnotations.getValue()[pageNumber][uuid];
        } else {
            for (let i = 0; i < this._allAnnotations.getValue().length; i++) {
                if (this._allAnnotations.getValue()[i]) {
                    delete this._allAnnotations.getValue()[i][uuid];
                    return;
                }
            }
        }
    }

    selectAnnotation(uuid: string, pageNumber: number) {

        let canvas = this.canvases[pageNumber];
        if (canvas) {
            let obj = this.getCanvasElemById(canvas, uuid);
            if (obj.constructor === Array) {
                // canvas.setActiveGroup(new fabric.Group(<IObject[]>obj));
            } else {
                canvas.setActiveObject(<IObject>obj);
            }
        }
    }

    deselectAllAnnotations() {
        for (let canvas of this.canvases) {
            if (canvas) {
                canvas.discardActiveObject();
                canvas.discardActiveGroup();
            }
        }
    }


    setTextSelectionMode(textSelection: boolean) {
        if (this.isTextSelectionMode != textSelection) {

            if (textSelection) {
                this.selectTool(AnnotationManager.DEFAULT_TOOL_TYPE);
            }
            this.isTextSelectionMode = textSelection;

            for (let c of this.canvases) {
                this.applyTextSelectionMode(c);
            }
        }
    }

    protected applyTextSelectionMode(canvas: ICanvas) {
        if (canvas) {
            canvas.getElement().parentElement.style.pointerEvents = (this.isTextSelectionMode) ? ('none') : ('auto');
        }
    }

    /*
     * Log manager
     */

    newLog(type: string, subtype: string, value: number): BaseAnnotation {
        let log: LogAnnotation = {
          type: type,
          action: subtype,
          value: value
        }
        let note: BaseAnnotation = {
          uuid: generateUUID(),
          pageNumber: 1,
          type: 'log',
          data: log
        };

        // if available, add the video time relative to the lesson
        let time = this.storeService.getCurrentTime();
        if (time && time > 0 && this.videoStartDate) {
          note.timestamp = this.getVideoDateRelativeToLesson(time, this.videoStartDate);
        }

        this.storage.addAnnotation(this.documentId, note);
        // set actual video time
        note.time = time;

      /*if (!this._allAnnotations.getValue()[1]) {
        this._allAnnotations.getValue()[1] = {};
      }
      this._allAnnotations.getValue()[1][note.uuid] = note;
      this._allAnnotations.next(this._allAnnotations.getValue());*/

        return note;
    }



  /* -----
   * Note Manager
   ----- */

    newNote(pageNumber: number): BaseAnnotation {
        let noteData: NoteAnnotation = {
            x: 10,
            y: 10,
            title: '',
            text: {} as DeltaStatic // delta
        };

        let note: BaseAnnotation = {
            uuid: generateUUID(),
            pageNumber: pageNumber,
            type: NoteTool.TYPE,
            data: noteData
        };

        // if available, add the video time relative to the lesson
        let time = this.storeService.getCurrentTime();
        if (time && time > 0 && this.videoStartDate) {
            note.timestamp = this.getVideoDateRelativeToLesson(time, this.videoStartDate);
        }

        this.storage.addAnnotation(this.documentId, note);
        // set actual video time
        note.time = time;

        if (!this._allAnnotations.getValue()[pageNumber]) {
            this._allAnnotations.getValue()[pageNumber] = {};
        }
        this._allAnnotations.getValue()[pageNumber][note.uuid] = note;
        this._allAnnotations.next(this._allAnnotations.getValue());
        return note;
    }

    saveNote(note: BaseAnnotation) {
        let pdfId = (note.pdfId) ? (note.pdfId) : (this.documentId);
        this.storage.editAnnotation(pdfId, note);
        this._allAnnotations.getValue()[note.pageNumber][note.uuid] = note;
        this._allAnnotations.next(this._allAnnotations.getValue());
    }

    deleteNote(uuid: string, pageNumber: number) {
        this.closeNote(uuid);
        this.storage.deleteAnnotation(this.documentId, uuid);
        delete this._allAnnotations.getValue()[pageNumber][uuid];
        this._allAnnotations.next(this._allAnnotations.getValue());
    }

    openNote(uuid: string, pageNumber: number, editMode: boolean) {

        if (this._openNotesUuid.getValue().indexOf(uuid) != -1) {
            return;
        }

        this._openNotesUuid.getValue().push(uuid);
        this.openNotesPageNumber.push(pageNumber);
        this.openNotesEditMode.push(editMode);
        this._openNotesUuid.next(this._openNotesUuid.getValue());
    }

    closeNote(uuid: string) {
        let i = this._openNotesUuid.getValue().indexOf(uuid);

        if (i != -1) {
            this._openNotesUuid.getValue().splice(i, 1);
            this.openNotesPageNumber.splice(i, 1);
            this.openNotesEditMode.splice(i, 1);
            this._openNotesUuid.next(this._openNotesUuid.getValue());
        }
    }

    getNote(uuid: string, pageNumber: number) {
        return this._allAnnotations.getValue()[pageNumber][uuid];
    }

    setHighlightedNote(uuid: string) {
        this._highlightedNote.next(uuid);
    }


    /* -----
     * Utils
     ----- */

    protected showTempErrMessage(msg: string) {
        this.errorMessage = msg;
        setTimeout(()=> {
            this.errorMessage = '';
        }, 5000);
    }

    protected scaleObject(object: IObject) {
        object.setScaleX(object.getScaleX() * this.getScaleValue());
        object.setScaleY(object.getScaleY() * this.getScaleValue());
        object.setLeft(object.getLeft() * this.getScaleValue());
        object.setTop(object.getTop() * this.getScaleValue());
        object.setCoords();
    }

    getScaleValue(): number {
        return (this.pdfViewer) ? (parseFloat(this.pdfViewer.currentScaleValue)) : (1.0);
    }

    protected objectToArray(obj: Object): any[] {
        return Object.keys(obj).map(key => obj[key]);
    }

    protected addToAllAnnotations(annotation: BaseAnnotation) {
        if (!this._allAnnotations.getValue()[annotation.pageNumber]) {
            this._allAnnotations.getValue()[annotation.pageNumber] = {};
        }
        this._allAnnotations.getValue()[annotation.pageNumber][annotation.uuid] = annotation;
    }

    protected getTextLayer(canvas: ICanvas): HTMLElement {
        if (canvas) {
            let textLayerElem: HTMLElement = <HTMLElement>canvas.getElement().parentElement.previousSibling;
            if (textLayerElem && (textLayerElem).classList.contains('textLayer')) {
                return textLayerElem;
            }
        }
        return null;
    }

    /**
     * Get the date relative to the lesson of a time relative to the video
     * @param videoTime the time relative to the video
     * @param lessonStartDate the start date of the video / lesson
     * @return {any} the date of the "videoTime" relative to the lesson start date
     */
    protected getVideoDateRelativeToLesson(videoTime: number, lessonStartDate: Date): Date {
        if (lessonStartDate && videoTime) {
            let d = new Date(lessonStartDate);
            d.setSeconds(d.getSeconds() + videoTime);
            return d;
        }
        return new Date();
    }
}
