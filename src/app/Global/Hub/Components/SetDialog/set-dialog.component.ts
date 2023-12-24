import {Component, Inject} from "@angular/core";
import Set from "../../../../Models/Set";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Kanji from "../../../../Models/Kanji";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: "set-dialog",
  templateUrl: "set-dialog.component.html",
  styleUrls: ["set-dialog.component.css"]
})

export class SetDialogComponent {
  mode: OpenMode
  set: Set
  isFinishAvailable: boolean

  setFormGroup

  constructor(private dialogRef: MatDialogRef<SetDialogComponent>, @Inject(MAT_DIALOG_DATA) props: DialogProperties) {
    this.set = props.set
    this.mode = props.mode
    this.isFinishAvailable = false
    this.setFormGroup = new FormGroup({
      nameControl: new FormControl(this.set.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      descriptionControl: new FormControl(this.set.description, [
        Validators.required,
        Validators.maxLength(90)])
    })
  }

  onFieldChange() {
    this.isFinishAvailable = this.setFormGroup.valid && this.isListCorrect(this.set.kanjiList);
  }

  onCloseClicked() {
    this.dialogRef.close()
  }

  onFinishClicked() {
    if (this.setFormGroup.valid) {
      this.set.name = this.setFormGroup.controls.nameControl.value!
      this.set.description = this.setFormGroup.controls.descriptionControl.value!
      this.dialogRef.close(this.set)
    } else {
      this.setFormGroup.markAllAsTouched()
    }
  }

  getNameErrorMessage() {
    if (this.setFormGroup.controls.nameControl.hasError(Validators.required.name)) {
      return "This field is required"
    }

    if (this.setFormGroup.controls.nameControl.hasError("minlength")) {
      return "This field must be at least 3 chars long"
    }

    if (this.setFormGroup.controls.nameControl.hasError("maxlength")) {
      return "This field must be not longer than 15 chars"
    }

    return "Unknown error"
  }

  getDescriptionErrorMessage() {
    if (this.setFormGroup.controls.descriptionControl.hasError(Validators.required.name)) {
      return "This field is required"
    }

    if (this.setFormGroup.controls.descriptionControl.hasError("maxlength")) {
      return "This field must be not longer than 90 chars"
    }

    return "Unknown error"
  }

  onKanjiListChange(kanjiList: Kanji[]) {
    this.isFinishAvailable = this.isListCorrect(kanjiList) && this.setFormGroup.valid
  }

  isListCorrect(kanjiList: Kanji[]) {
    let isCorrect = true
    kanjiList.forEach(kanji => {
      if (kanji.kanji == "" || (kanji.kunyomi.length == 0 && kanji.onyomi.length == 0))
        isCorrect = false
    })
    return isCorrect
  }
}

export enum OpenMode {
  edit = "edit",
  create = "create"
}

export class DialogProperties {
  mode: OpenMode
  set: Set


  constructor(mode: OpenMode, set: Set) {
    this.mode = mode;
    this.set = set;
  }
}
