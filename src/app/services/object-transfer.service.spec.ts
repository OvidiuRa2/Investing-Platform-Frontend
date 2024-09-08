import { TestBed } from '@angular/core/testing';

import { ObjectTransferService } from './object-transfer.service';

describe('ObjectTransferService', () => {
  let service: ObjectTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
