import { TestBed } from '@angular/core/testing';

import { MetadataService } from './metadata.service';

describe('MetadataServiceService', () => {
  let service: MetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
