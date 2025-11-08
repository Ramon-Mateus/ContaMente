import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DiaFiscalComponent } from './dia-fiscal.component'

describe('DiaFiscalComponent', () => {
  let component: DiaFiscalComponent
  let fixture: ComponentFixture<DiaFiscalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaFiscalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DiaFiscalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
