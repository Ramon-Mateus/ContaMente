import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelDaSemanaComponent } from './painel-da-semana.component';

describe('PainelDaSemanaComponent', () => {
  let component: PainelDaSemanaComponent;
  let fixture: ComponentFixture<PainelDaSemanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelDaSemanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelDaSemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
