import { TestBed } from '@angular/core/testing';

import { DomainServiceService } from './domain-service.service';

describe('DomainServiceService', () => {
  let service: DomainServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
