import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'remove-confirmation-dialog',
  templateUrl: 'remove-confirmation-dialog.component.html',
  styleUrls: ['remove-confirmation-dialog.component.css']
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
