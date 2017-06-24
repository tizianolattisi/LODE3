import { TestBed, inject } from '@angular/core/testing';

import { IconService } from './icon.service';

describe('IconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconService]
    });
  });

  it('should be created', inject([IconService], (service: IconService) => {
    expect(service).toBeTruthy();
  }));
});
