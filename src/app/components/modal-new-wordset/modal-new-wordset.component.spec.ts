import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewWordsetComponent } from './modal-new-wordset.component';

describe('ModalNewWordsetComponent', () => {
  let component: ModalNewWordsetComponent;
  let fixture: ComponentFixture<ModalNewWordsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewWordsetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewWordsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
