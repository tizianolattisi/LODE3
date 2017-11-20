import {Tool} from '../../service/tools/tool';
import {TOOLS} from '../../service/tools/tool-opaque-token';
import {Annotation, DataType} from '../../service/model/annotation';
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {ChangeDetectionStrategy, Component, Inject, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {DeleteAnnotation} from '../../store/annotation/annotation.actions';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'l3-lateral-bar-annotations',
  templateUrl: './lateral-bar-annotations.component.html',
  styleUrls: ['./lateral-bar-annotations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateralBarAnnotationsComponent implements OnInit, OnDestroy {

  annotations: {[slideId: string]: {[annId: string]: Annotation}};

  private tools: {[type: string]: Tool<DataType>} = {};

  private annsSubscr: Subscription;

  constructor(private store: Store<AppState>, @Inject(TOOLS) tools: Tool<DataType>[], private cd: ChangeDetectorRef) {
    tools.forEach(t => {
      this.tools[t.TYPE] = t;
    });
  }

  ngOnInit() {
    this.annsSubscr = this.store.select(s => s.annotation.annotations).subscribe(anns => {
      this.annotations = {};
      this.cd.detectChanges();
      this.annotations = anns;
      this.cd.detectChanges();
    });
  }

  // onSelect(index: number) {
  //   this.store.dispatch(new SelectAnnotation(index));
  // }

  onDelete(annotation: Annotation) {
    this.store.dispatch(new DeleteAnnotation({
      lectureId: annotation.lectureId,
      slideId: annotation.slideId,
      annotationId: annotation.uuid
    }));
  }

  getToolIcon(type: string) {
    return this.tools[type] ? this.tools[type].ICON : null;
  }

  getToolName(type: string) {
    return this.tools[type] ? this.tools[type].NAME : null;
  }

  ngOnDestroy() {
    this.annsSubscr.unsubscribe();
  }

}