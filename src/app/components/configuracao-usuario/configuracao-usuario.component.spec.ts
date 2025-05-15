import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoUsuarioComponent } from './configuracao-usuario.component';

describe('ConfiguracaoUsuarioComponent', () => {
  let component: ConfiguracaoUsuarioComponent;
  let fixture: ComponentFixture<ConfiguracaoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
