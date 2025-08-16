import { TestBed } from '@angular/core/testing';

import { ResponsavelService } from './responsavel.service';

describe('ResponsavelService', () => {
  let service: ResponsavelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsavelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
