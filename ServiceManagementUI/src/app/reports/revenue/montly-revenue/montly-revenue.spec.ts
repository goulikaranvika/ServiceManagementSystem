import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontlyRevenue } from './montly-revenue';

describe('MontlyRevenue', () => {
  let component: MontlyRevenue;
  let fixture: ComponentFixture<MontlyRevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontlyRevenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontlyRevenue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
