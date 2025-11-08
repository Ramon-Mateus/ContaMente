import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VisualizacaoTabComponent } from './visualizacao-tab.component'

describe('VisualizacaoTabComponent', () => {
  let component: VisualizacaoTabComponent
  let fixture: ComponentFixture<VisualizacaoTabComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacaoTabComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(VisualizacaoTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
