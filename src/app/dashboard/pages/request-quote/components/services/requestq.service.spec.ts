import { TestBed } from '@angular/core/testing';

import { RequestqService } from './requestq.service';

describe('RequestqService', () => {
  let service: RequestqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
