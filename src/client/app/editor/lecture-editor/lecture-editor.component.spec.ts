import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureEditorComponent } from './lecture-editor.component';

describe('LectureEditorComponent', () => {
  let component: LectureEditorComponent;
  let fixture: ComponentFixture<LectureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
