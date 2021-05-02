import { TestBed } from '@angular/core/testing';

import { NotUserGuard } from './not-user-guard.service';

describe('NotUserGuardGuard', () => {
  let guard: NotUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
