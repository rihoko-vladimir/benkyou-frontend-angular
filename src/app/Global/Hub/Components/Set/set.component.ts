import {Component, EventEmitter, Input, Output} from "@angular/core";
import Set from "../../../../Models/Set"
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {DialogProperties, OpenMode, SetDialogComponent} from "../SetDialog/set-dialog.component";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {startStudying} from "../../../../Redux/Actions/set-study.actions";
import AppState from "../../../../Redux/app.state";
import {MySetsService} from "../../../../Services/my-sets.service";
import {RemoveConfirmationDialogComponent} from "../RemoveConfirmationDialog/remove-confirmation-dialog.component";
import {DialogData, SetPreviewDialogComponent} from "../SetPreview/set-preview-dialog.component";

@Component({
  selector: "set",
  templateUrl: "set.component.html",
  styleUrls: ["set.component.css"],
})

export class SetComponent {
  @Input() set!: Set
  @Input() mode!: string
  @Output() setChange = new EventEmitter<Set>();
  @Output() remove = new EventEmitter<string>();

  constructor(private dialog: MatDialog, private router: Router, private store: Store<AppState>, private mySetsService: MySetsService) {
  }

  onRemoveClicked(id: string) {
    this.dialog.open(RemoveConfirmationDialogComponent)
      .afterClosed().subscribe((isUserAgreed) => {
      if (isUserAgreed) {
        this.remove.emit(id)
      }
    })
  }

  onEditClicked() {
    this.dialog.open(SetDialogComponent, {
      data: new DialogProperties(OpenMode.edit, JSON.parse(JSON.stringify(this.set)))
    }).afterClosed().subscribe((set) => this.onSetChanged(set))
  }

  onSetChanged(editedSet: Set | undefined) {
    if (editedSet === undefined) {
      console.log("set wasn't changed")
    } else {
      console.log(editedSet)
      this.setChange.emit(editedSet)
    }
  }

  async onStudyClicked() {
    this.store.dispatch(startStudying({set: this.set}))
    await this.router.navigate(["hub", "study"])
  }

  onAddClicked() {
    this.mySetsService.addSet(this.set)
  }

  openPreview() {
    this.dialog.open(SetPreviewDialogComponent, {
      data: new DialogData(JSON.parse(JSON.stringify(this.set.kanjiList))),
      width: "40vw"
    })
  }
}
