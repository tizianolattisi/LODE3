import { Component, SimpleChanges, Renderer2, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/store/app-state';
import { CloseNote } from '../../store/annotation/annotation.actions';
import { Annotation, NoteData } from '../../service/model/annotation';

@Component({
  selector: 'note-reader',
  templateUrl: './note-reader.component.html',
  styleUrls: ['./note-reader.component.scss']
})

/**
 * Componente che permette di visualizzare le note di tipo "pen"
 */
export class NoteReaderComponent implements OnChanges {

  expanded = false;
  note: Annotation<NoteData>;

  @ViewChild('window') windowElem: ElementRef;
  @Input() noteInfo: { slideId: string; annotationId: string };

  /**
   * Metodo costruttore
   * @param store store dei dati della sessione
   * @param renderer elaborazione del DOM
   */
  constructor(
    private store: Store<AppState>,
    private renderer: Renderer2
  ) { }

  /**
   * Quando viene effettuata una modifica aggiorno la nota attualmente visualizzata
   * @param changes Modifiche effettuate
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.noteInfo) {
      this.store.select(s => s.video.allAnnotations).subscribe(data => {
        let actual = data.get(this.noteInfo.slideId)
        if (actual !== undefined) {
          for (let x of actual) {
            if (x.uuid === this.noteInfo.annotationId) {
              this.note = x as Annotation<NoteData>
              break
            }
          }
        }
      })

    }
  }

  /**
   * Metodo che permette di espandere a schermo intero la nota
   */
  onExpand() {
    if (this.expanded) {
      this.renderer.removeClass(this.windowElem.nativeElement, 'expanded');
    } else {
      this.renderer.addClass(this.windowElem.nativeElement, 'expanded');
    }
    this.expanded = !this.expanded;
  }

  /**
   * Metodo che permette di chiudere la nota
   */
  onClose() {
    this.store.dispatch(new CloseNote(this.noteInfo));
  }

}
