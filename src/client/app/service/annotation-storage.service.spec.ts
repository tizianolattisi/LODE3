import { TestBed, inject } from '@angular/core/testing';

import { AnnotationStorageService } from './annotation-storage.service';

describe('AnnotationStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnotationStorageService]
    });
  });

  it('should be created', inject([AnnotationStorageService], (service: AnnotationStorageService) => {
    expect(service).toBeTruthy();
  }));
});
