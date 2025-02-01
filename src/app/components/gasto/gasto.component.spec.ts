import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastoComponent } from './gasto.component';

describe('GastoComponent', () => {
  let component: GastoComponent;
  let fixture: ComponentFixture<GastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
