import {Component, EventEmitter, Input, Output} from "@angular/core";
import Set from "../../../../Models/Set"
import {MatDialog} from "@angular/material/dialog";
import {DialogProperties, OpenMode, SetDialogComponent} from "../SetDialog/set-dialog.component";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {startStudying} from "../../../../Redux/Actions/set-study.actions";

@Component({
  selector: "set",
  templateUrl: "set.component.html",
  styleUrls: ["set.component.css"]
})

export class SetComponent {
  isOpened: boolean
  @Input() set!: Set
  @Output() setChange = new EventEmitter<Set>();
  @Output() remove = new EventEmitter<string>();
  constructor(private dialog: MatDialog, private router : Router, private store : Store) {
    this.isOpened = false
  }

  changeOpenedStatus(){
    this.isOpened = !this.isOpened
  }

  onRemoveClicked(id: string) {
    this.remove.emit(id)
  }

  onEditClicked() {
    this.dialog.open(SetDialogComponent, {
      data : new DialogProperties(OpenMode.edit, JSON.parse(JSON.stringify(this.set)))
    }).afterClosed().subscribe((set) => this.onSetChanged(set))
  }

  onSetChanged(editedSet : Set | undefined){
    if (editedSet === undefined){
      console.log("set wasn't changed")
    }else{
      console.log(editedSet)
      this.setChange.emit(editedSet)
    }
  }

   async onStudyClicked() {
    this.store.dispatch(startStudying({set : this.set}))
    await this.router.navigate(["hub", "study"])
  }
}
