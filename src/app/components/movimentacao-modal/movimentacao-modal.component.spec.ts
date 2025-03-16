import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacaoModalComponent } from './movimentacao-modal.component';

describe('MovimentacaoModalComponent', () => {
  let component: MovimentacaoModalComponent;
  let fixture: ComponentFixture<MovimentacaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentacaoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentacaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
