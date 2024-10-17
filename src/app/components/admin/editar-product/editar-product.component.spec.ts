import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductComponent } from './editar-product.component';

describe('EditarProductComponent', () => {
  let component: EditarProductComponent;
  let fixture: ComponentFixture<EditarProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
