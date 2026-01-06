import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Assign Role to {{data.user.fullName}}</h2>
    <mat-dialog-content>
      <form [formGroup]="roleForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Select Role</mat-label>
          <mat-select formControlName="roleId" required>
            <mat-option *ngFor="let role of roles" [value]="role.roleId">
              {{role.roleName}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!roleForm.valid">
        Assign Role
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class RoleDialog {
  roleForm: FormGroup;
  roles = [
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'ServiceManager' },
    { roleId: 3, roleName: 'Technician' },
    { roleId: 4, roleName: 'Customer' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleForm = this.fb.group({
      roleId: [data.user.roleId, Validators.required]
    });
  }

  onSave(): void {
    if (this.roleForm.valid) {
      this.dialogRef.close(this.roleForm.value.roleId);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
