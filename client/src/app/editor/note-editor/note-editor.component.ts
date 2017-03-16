import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, Input} from '@angular/core';
import Timer = NodeJS.Timer;
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {NoteAnnotation} from "../../annotation/model/NoteAnnotation";
import DeltaStatic = Quill.DeltaStatic;
import {Quill as tQuill} from "quill";

declare var Quill: tQuill;

@Component({
  selector: 'note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteEditorComponent {


  @ViewChild('noteWindow') windowElem: ElementRef;
  @ViewChild('quillToolbar') quillToolbarElem: ElementRef;
  @ViewChild('quillEditor') quillEditorElem: ElementRef;

  @Input() noteUuid: string;
  @Input() notePage: number;
  @Input() readOnly: boolean;
  @Input() editMode: boolean;

  note: any;
  quillEditor: tQuill;

  // window variables
  expanded = false;
  preventDrag = false;

  // text edit
  textEdited: DeltaStatic;
  saveTimer: Timer;
  edited: boolean = false;


  constructor(private am: AnnotationManager) {
  }

  ngOnInit(): void {
    // get note
    this.note = this.am.getNote(this.noteUuid, this.notePage);

    // init quill
    this.quillEditor = new Quill(this.quillEditorElem.nativeElement, {
      modules: {
        toolbar: this.quillToolbarElem.nativeElement,
        formula: true
      },
      theme: 'snow'
    });

    this.quillEditor.enable(!this.readOnly && this.editMode);
    if ((<NoteAnnotation>this.note.data).text) {
      this.quillEditor.setContents((<NoteAnnotation>this.note.data).text);
    }

    // listen for note text modifications
    this.quillEditor.on('text-change', (delta, oldDelta, source) => {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
      }
      this.saveTimer = setTimeout(()=> {
        this.saveNote();
      }, 5000);

      this.edited = true;
      this.textEdited = this.quillEditor.getContents();
    });
  }


  /* -----
   * Note changes methods
   ----- */

  titleChange() {
    this.edited = true;
  }

  private saveNote() {
    if (this.edited) {
      if (this.textEdited) {
        (<NoteAnnotation>this.note.data).text = this.textEdited;
      }
      this.am.saveNote(this.note);
      this.edited = false;
    }
  }

  /* -----
   * Window methods
   ----- */

  closeWindow() {
    if (this.edited) {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
      }
      this.saveNote();
    }
    this.am.closeNote(this.noteUuid);
  }

  switchMode() {
    this.editMode = !this.editMode;
    this.quillEditor.enable(!this.readOnly && this.editMode);
  }

  expandWindow() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.preventDrag = true;
      this.windowElem.nativeElement.style.left = '0';
      this.windowElem.nativeElement.style.top = '0';
      this.windowElem.nativeElement.style.width = '100%';
      this.windowElem.nativeElement.style.height = '100%';
    } else {
      this.preventDrag = false;
      this.windowElem.nativeElement.style.left = '72px';
      this.windowElem.nativeElement.style.top = '56px';
      this.windowElem.nativeElement.style.width = '625px';
      this.windowElem.nativeElement.style.height = '300px';
    }
  }

}
