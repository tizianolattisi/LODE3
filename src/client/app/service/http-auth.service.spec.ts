import { TestBed, inject } from '@angular/core/testing';

import { HttpAuthService } from './http-auth.service';

describe('HttpAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpAuthService]
    });
  });

  it('should be created', inject([HttpAuthService], (service: HttpAuthService) => {
    expect(service).toBeTruthy();
  }));
});
