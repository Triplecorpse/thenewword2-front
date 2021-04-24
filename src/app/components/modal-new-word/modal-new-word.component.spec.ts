import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewWordComponent } from './modal-new-word.component';

describe('ModalNewWordComponent', () => {
  let component: ModalNewWordComponent;
  let fixture: ComponentFixture<ModalNewWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
