import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDialog } from './role-dialog';

describe('RoleDialog', () => {
  let component: RoleDialog;
  let fixture: ComponentFixture<RoleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
