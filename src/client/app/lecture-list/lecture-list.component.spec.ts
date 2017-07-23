import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureListComponent } from './lecture-list.component';

describe('LectureListComponent', () => {
  let component: LectureListComponent;
  let fixture: ComponentFixture<LectureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
