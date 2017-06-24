import { TestBed, async, inject } from '@angular/core/testing';

import { CodeParamGuard } from './code-param.guard';

describe('CodeParamGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeParamGuard]
    });
  });

  it('should ...', inject([CodeParamGuard], (guard: CodeParamGuard) => {
    expect(guard).toBeTruthy();
  }));
});
