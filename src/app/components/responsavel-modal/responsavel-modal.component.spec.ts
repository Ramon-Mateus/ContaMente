import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResponsavelModalComponent } from './responsavel-modal.component'

describe('ResponsavelModalComponent', () => {
  let component: ResponsavelModalComponent
  let fixture: ComponentFixture<ResponsavelModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsavelModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ResponsavelModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
