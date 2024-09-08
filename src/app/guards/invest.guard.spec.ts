import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { investGuard } from './invest.guard';

describe('investGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => investGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
