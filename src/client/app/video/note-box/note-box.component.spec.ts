import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBoxComponent } from './note-box.component';

describe('NoteBoxComponent', () => {
  let component: NoteBoxComponent;
  let fixture: ComponentFixture<NoteBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
