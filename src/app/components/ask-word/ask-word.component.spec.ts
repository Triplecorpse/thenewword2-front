import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskWordComponent } from './ask-word.component';

describe('AskWordComponent', () => {
  let component: AskWordComponent;
  let fixture: ComponentFixture<AskWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
