import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaModalComponent } from './categoria-modal.component';

describe('CategoriaModalComponent', () => {
  let component: CategoriaModalComponent;
  let fixture: ComponentFixture<CategoriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
