import {Observable} from "rxjs/Observable";
import {BaseAnnotation} from "./model/BaseAnnotation";

export interface NoteManager {

    allAnnotations: Observable<{[type: string]: BaseAnnotation}[]>;

    highlightedNote: Observable<string>;
    openNotesUuid: Observable<string[]>;
    openNotesPageNumber: number[];
    openNotesEditMode: boolean[];

    getNote(uuid: string, pageNumber: number): BaseAnnotation;
    newNote (pageNumber: number, time: number): BaseAnnotation;
    saveNote(note: BaseAnnotation):void;
    deleteNote(uuid: string, pageNumber: number):void;
    openNote(uuid: string, pageNumber: number, editMode: boolean, readOnly?: boolean):void;
    closeNote(uuid: string):void;
    setHighlightedNote(uuid: string):void;
}