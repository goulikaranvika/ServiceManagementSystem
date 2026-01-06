import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceReport } from './service-report';

describe('ServiceReport', () => {
  let component: ServiceReport;
  let fixture: ComponentFixture<ServiceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
