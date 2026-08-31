import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import Set from '../../../../Models/Set';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Kanji from '../../../../Models/Kanji';

import { MatButton } from '@angular/material/button';
import { EditKanjiListComponent } from './EditKanjiList/edit-kanji-list.component';
import { MatDivider } from '@angular/material/divider';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-set-dialog',
  templateUrl: 'set-dialog.component.html',
  styleUrl: 'set-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDivider,
    EditKanjiListComponent,
    MatDialogActions,
    MatButton
  ]
})
export class SetDialogComponent {
  private dialogRef = inject<MatDialogRef<SetDialogComponent>>(MatDialogRef);

  mode: OpenMode;
  set: Set;
  isFinishAvailable: boolean;

  setFormGroup;

  constructor() {
    const props = inject<DialogProperties>(MAT_DIALOG_DATA);

    this.set = props.set;
    this.mode = props.mode;
    this.isFinishAvailable = false;
    this.setFormGroup = new FormGroup({
      nameControl: new FormControl(this.set.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      descriptionControl: new FormControl(this.set.description, [Validators.required, Validators.maxLength(90)])
    });
  }

  onFieldChange() {
    this.isFinishAvailable = this.setFormGroup.valid && this.isListCorrect(this.set.kanjiList);
  }

  onCloseClicked() {
    this.dialogRef.close();
  }

  onFinishClicked() {
    if (this.setFormGroup.valid) {
      this.set.name = this.setFormGroup.controls.nameControl.value!;
      this.set.description = this.setFormGroup.controls.descriptionControl.value!;
      this.dialogRef.close(this.set);
    } else {
      this.setFormGroup.markAllAsTouched();
    }
  }

  getNameErrorMessage() {
    if (this.setFormGroup.controls.nameControl.hasError(Validators.required.name)) {
      return 'This field is required';
    }

    if (this.setFormGroup.controls.nameControl.hasError('minlength')) {
      return 'This field must be at least 3 chars long';
    }

    if (this.setFormGroup.controls.nameControl.hasError('maxlength')) {
      return 'This field must be not longer than 15 chars';
    }

    return 'Unknown error';
  }

  getDescriptionErrorMessage() {
    if (this.setFormGroup.controls.descriptionControl.hasError(Validators.required.name)) {
      return 'This field is required';
    }

    if (this.setFormGroup.controls.descriptionControl.hasError('maxlength')) {
      return 'This field must be not longer than 90 chars';
    }

    return 'Unknown error';
  }

  onKanjiListChange(kanjiList: Kanji[]) {
    this.isFinishAvailable = this.isListCorrect(kanjiList) && this.setFormGroup.valid;
  }

  isListCorrect(kanjiList: Kanji[]) {
    let isCorrect = true;
    kanjiList.forEach(kanji => {
      if (kanji.kanji === '' || (kanji.kunyomi.length === 0 && kanji.onyomi.length === 0)) isCorrect = false;
    });
    return isCorrect;
  }
}

export enum OpenMode {
  edit = 'edit',
  create = 'create'
}

export class DialogProperties {
  mode: OpenMode;
  set: Set;

  constructor(mode: OpenMode, set: Set) {
    this.mode = mode;
    this.set = set;
  }
}
