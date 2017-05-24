import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import DeltaStatic = Quill.DeltaStatic;
import {BehaviorSubject} from "rxjs/BehaviorSubject";

/**
 * Service that registers open and closed notes and highlighted notes.
 */
@Injectable()
export class OpenNotes {

  private _openNotesUuid: BehaviorSubject<string[]> = new BehaviorSubject([]);
  openNotesUuid: Observable<string[]> = this._openNotesUuid.asObservable();
  openNotesPageNumber: number[] = [];
  openNotesEditMode: boolean[] = [];
  private _highlightedNote: BehaviorSubject<string> = new BehaviorSubject('');
  highlightedNote: Observable<string> = this._highlightedNote.asObservable();


  constructor() {
    this._openNotesUuid.next([]);
    this.openNotesPageNumber = [];
    this.openNotesEditMode = [];
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

  setHighlightedNote(uuid: string) {
    this._highlightedNote.next(uuid);
  }
}
