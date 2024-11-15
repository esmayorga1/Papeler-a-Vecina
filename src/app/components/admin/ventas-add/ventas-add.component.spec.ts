import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAddComponent } from './ventas-add.component';

describe('VentasAddComponent', () => {
  let component: VentasAddComponent;
  let fixture: ComponentFixture<VentasAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
