import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CartaoModalComponent } from './cartao-modal.component'

describe('CartaoModalComponent', () => {
  let component: CartaoModalComponent
  let fixture: ComponentFixture<CartaoModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaoModalComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CartaoModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
