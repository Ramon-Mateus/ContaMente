import { TestBed } from '@angular/core/testing';

import { TipoPagamentoService } from './tipo-pagamento.service';

describe('TipoPagamentoService', () => {
  let service: TipoPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
