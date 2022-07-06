import {Component, Input} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import Set from "../../../../Models/Set";

@Component({
  selector:"set-dialog",
  templateUrl: "set-dialog.component.html",
  styleUrls: ["set-dialog.component.css"]
})

export class SetDialogComponent{
  @Input() mode! : OpenMode
  @Input() set! : Set

  constructor(private dialogRef : MatDialogRef<SetDialogComponent>) {
  }

  onCloseClicked() {
    this.dialogRef.close()
  }

  onCreateClicked() {

  }

  onEditClicked() {

  }
}

export enum OpenMode{
  edit = "edit",
  create = "create"
}
