import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CartoesTabComponent } from './cartoes-tab.component'

describe('CartoesTabComponent', () => {
  let component: CartoesTabComponent
  let fixture: ComponentFixture<CartoesTabComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartoesTabComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CartoesTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
