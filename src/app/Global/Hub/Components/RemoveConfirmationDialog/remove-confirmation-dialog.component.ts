import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-remove-confirmation-dialog',
  templateUrl: 'remove-confirmation-dialog.component.html',
  styleUrls: ['remove-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton]
})
export class RemoveConfirmationDialogComponent {
  private dialogRef = inject<MatDialogRef<RemoveConfirmationDialogComponent>>(MatDialogRef);

  onCancelClicked() {
    this.dialogRef.close(false);
  }

  onConfirmClicked() {
    this.dialogRef.close(true);
  }
}
