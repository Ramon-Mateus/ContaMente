import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CategoriasTabComponent } from './categorias-tab.component'

describe('CategoriasTabComponent', () => {
  let component: CategoriasTabComponent
  let fixture: ComponentFixture<CategoriasTabComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasTabComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CategoriasTabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
