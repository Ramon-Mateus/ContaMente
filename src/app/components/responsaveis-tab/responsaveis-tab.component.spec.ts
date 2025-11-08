import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResponsaveisTabComponent } from './responsaveis-tab.component'

describe('ResponsaveisTabComponent', () => {
  let component: ResponsaveisTabComponent
  let fixture: ComponentFixture<ResponsaveisTabComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsaveisTabComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ResponsaveisTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
