import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadReport } from './workload-report';

describe('WorkloadReport', () => {
  let component: WorkloadReport;
  let fixture: ComponentFixture<WorkloadReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkloadReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkloadReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
