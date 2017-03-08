import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnnotationsAsArrayPipe} from './annotations-as-array.pipe';
import {DictionaryToArrayPipe} from './dictionary-to-array.pipe';
import {DraggableDirective} from './draggable.directive';
import {FilterNotesPipe} from './filter-notes.pipe';
import {QuillDirective} from './quill.directive';
import {ResizableDirective} from './resizable.directive';
import {SecToTimePipe} from './sec-to-time.pipe';
import {ViewerToolbarComponent} from "../editor/viewer-toolbar/viewer-toolbar.component";
import {NoteBarComponent} from "../editor/note-bar/note-bar.component";
import {NoteEditorComponent} from "../editor/note-editor/note-editor.component";
import {NoteComponent} from "../editor/note/note.component";
import {VideoBoxComponent} from "../video/video-box/video-box.component";
import {VideoToolbarComponent} from "../video/video-toolbar/video-toolbar.component";
import {TimelineComponent} from "../video/timeline/timeline.component";
import {FormsModule} from "@angular/forms";
import {SlideViewerComponent} from "../video/slide-viewer/slide-viewer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ViewerToolbarComponent,
    SlideViewerComponent,
    NoteBarComponent,
    NoteEditorComponent,
    NoteComponent,
    DictionaryToArrayPipe,
    FilterNotesPipe,
    QuillDirective,
    ResizableDirective,
    DraggableDirective,
    VideoBoxComponent,
    VideoToolbarComponent,
    TimelineComponent,
    AnnotationsAsArrayPipe,
    SecToTimePipe
  ], exports: [
    ViewerToolbarComponent,
    SlideViewerComponent,
    NoteBarComponent,
    NoteEditorComponent,
    NoteComponent,
    DictionaryToArrayPipe,
    FilterNotesPipe,
    QuillDirective,
    ResizableDirective,
    DraggableDirective,
    VideoBoxComponent,
    VideoToolbarComponent,
    TimelineComponent,
    AnnotationsAsArrayPipe,
    SecToTimePipe
  ]
})
export class SharedModule {
}
