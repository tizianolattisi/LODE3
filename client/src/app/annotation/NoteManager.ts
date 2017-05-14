import {BaseAnnotation} from "./model/BaseAnnotation";
import {Injectable} from "@angular/core";
import {AnnotationManager} from "./AnnotationManager";
import {NoteAnnotation} from "./model/NoteAnnotation";
import DeltaStatic = Quill.DeltaStatic;
import {NoteTool} from "./tools/NoteTool";
import {OpenNotes} from "./OpenNotes";

/**
 * Service to handle notes.
 */
@Injectable()
export class NoteManager {

  constructor(private annotationManager: AnnotationManager, private openNotes: OpenNotes) {
  }

  /**
   * Add a new note on page.
   * @param pageNumber Page number.
   * @return {any} Created annotation.
   */
  newNote(pageNumber: number): BaseAnnotation {
    // Generate basic note data
    let noteData: NoteAnnotation = {
      x: 10,
      y: 10,
      title: '',
      text: {} as DeltaStatic
    };

    // Draw note on canvas
    let noteObject = NoteTool.drawNotePlaceholder(noteData.x, noteData.y, this.annotationManager.getCanvas(pageNumber));

    // Add new note annotation
    return this.annotationManager.addNewAnnotation(NoteTool.TYPE, pageNumber, {
      pageNumber: pageNumber,
      annotationData: noteData,
      canvasAnnotation: noteObject,
    });
  }

  /**
   * Save an edited note. NB: To create a new note, use "newNote".
   * @param note Edited note to save.
   */
  saveNote(note: BaseAnnotation) {
    this.annotationManager.editAnnotation(note);
  }

  /**
   * Delete a note.
   * @param uuid Note's uuid.
   * @param pageNumber Note's page number.
   */
  deleteNote(uuid: string, pageNumber: number) {
    this.closeNote(uuid);
    this.annotationManager.deleteAnnotation(uuid, pageNumber);
  }

  openNote(uuid: string, pageNumber: number, editMode: boolean) {
    this.openNotes.openNote(uuid, pageNumber, editMode);
  }

  closeNote(uuid: string) {
    this.openNotes.closeNote(uuid);
  }

  getNotes() {
    return this.annotationManager.getAnnotations();
  }

  getNote(uuid: string, pageNumber: number) {
    return this.annotationManager.getAnnotation(uuid, pageNumber);
  }

  setHighlightedNote(uuid: string) {
    this.openNotes.setHighlightedNote(uuid);
  }
}
