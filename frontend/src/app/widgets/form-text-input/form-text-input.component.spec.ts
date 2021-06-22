import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextInputComponent } from './form-text-input.component';

describe('FormTextInputComponent', () => {
  let component: FormTextInputComponent;
  let fixture: ComponentFixture<FormTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTextInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
