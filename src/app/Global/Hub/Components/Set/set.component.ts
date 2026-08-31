import { Component, EventEmitter, Input, Output, inject, ChangeDetectionStrategy } from '@angular/core';
import Set from '../../../../Models/Set';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogProperties, OpenMode, SetDialogComponent } from '../SetDialog/set-dialog.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { startStudying } from '../../../../Redux/Actions/set-study.actions';
import AppState from '../../../../Redux/app.state';
import { MySetsService } from '../../../../Services/my-sets.service';
import { addSetSuccess } from '../../../../Redux/Actions/snackbar.actions';
import { loadMySetsFailure } from '../../../../Redux/Actions/my-sets.actions';
import { RemoveConfirmationDialogComponent } from '../RemoveConfirmationDialog/remove-confirmation-dialog.component';
import { DialogData, SetPreviewDialogComponent } from '../SetPreview/set-preview-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton, MatButton } from '@angular/material/button';

import { MatCard, MatCardTitle, MatCardSubtitle, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-set',
  templateUrl: 'set.component.html',
  styleUrls: ['set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatCardActions,
    MatButton,
    MatDialogModule
  ]
})
export class SetComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private store = inject<Store<AppState>>(Store);
  private mySetsService = inject(MySetsService);

  @Input() set!: Set;
  @Input() mode!: string;
  @Output() setChange = new EventEmitter<Set>();
  @Output() remove = new EventEmitter<string>();

  onRemoveClicked(id: string) {
    this.dialog
      .open(RemoveConfirmationDialogComponent)
      .afterClosed()
      .subscribe(isUserAgreed => {
        if (isUserAgreed) {
          this.remove.emit(id);
        }
      });
  }

  onEditClicked() {
    this.dialog
      .open(SetDialogComponent, {
        data: new DialogProperties(OpenMode.edit, JSON.parse(JSON.stringify(this.set)))
      })
      .afterClosed()
      .subscribe(set => this.onSetChanged(set));
  }

  onSetChanged(editedSet: Set | undefined) {
    if (editedSet !== undefined) {
      this.setChange.emit(editedSet);
    }
  }

  async onStudyClicked() {
    this.store.dispatch(startStudying({ set: this.set }));
    await this.router.navigate(['hub', 'study']);
  }

  onAddClicked() {
    this.mySetsService.addSet(this.set).subscribe({
      next: () => this.store.dispatch(addSetSuccess()),
      error: error => this.store.dispatch(loadMySetsFailure({ errorMessage: error.error }))
    });
  }

  openPreview() {
    this.dialog.open(SetPreviewDialogComponent, {
      data: new DialogData(JSON.parse(JSON.stringify(this.set.kanjiList))),
      width: '40vw'
    });
  }
}
