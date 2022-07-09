import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnWordComponent } from './learn-word.component';

describe('LearnWordComponent', () => {
  let component: LearnWordComponent;
  let fixture: ComponentFixture<LearnWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
