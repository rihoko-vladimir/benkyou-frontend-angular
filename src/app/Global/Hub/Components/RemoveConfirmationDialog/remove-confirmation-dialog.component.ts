import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'remove-confirmation-dialog',
    templateUrl: 'remove-confirmation-dialog.component.html',
    styleUrls: ['remove-confirmation-dialog.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton]
})
export class RemoveConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<RemoveConfirmationDialogComponent>) {}

  onCancelClicked() {
    this.dialogRef.close(false);
  }

  onConfirmClicked() {
    this.dialogRef.close(true);
  }
}
