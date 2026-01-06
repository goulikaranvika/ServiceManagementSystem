import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitFeedback } from './submit-feedback';

describe('SubmitFeedback', () => {
  let component: SubmitFeedback;
  let fixture: ComponentFixture<SubmitFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitFeedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
