import {Component, OnDestroy, OnInit} from "@angular/core";
import Set from "../../../../Models/Set"
import {MatDialog} from "@angular/material/dialog";
import {DialogProperties, OpenMode, SetDialogComponent} from "../../Components/SetDialog/set-dialog.component";
import {Store} from "@ngrx/store";
import AppState from "../../../../Redux/app.state";
import {MySetsService} from "../../../../Services/my-sets.service";

@Component({
  selector: "my-sets-page",
  templateUrl: "my-sets.component.html",
  styleUrls: ["my-sets.component.css"]
})

export class MySetsComponent implements OnInit, OnDestroy {
  sets: Set[] = []
  currentPage: number = 1
  pageSize: number = 9
  pagesCount: number = 1
  subscription

  constructor(private dialog: MatDialog, private store: Store<AppState>, private mySetsService: MySetsService) {
    this.subscription = store.select("mySets").subscribe(value => {
      console.log(value)
      this.currentPage = value.currentPage
      this.pagesCount = value.pagesCount
      this.pageSize = value.setsCount
      this.sets = value.sets
    })
  }

  onCreateNewSetClicked() {
    this.dialog.open(SetDialogComponent, {
      data: new DialogProperties(OpenMode.create, new Set())
    }).afterClosed().subscribe((set) => this.onSetCreated(set))
  }

  onSetCreated(set: Set | undefined) {
    if (set !== undefined) {
      this.mySetsService.createSet(set!)
    } else {
      console.log("Set wasn't created")
    }
  }

  ngOnInit(): void {
    this.mySetsService.getMySets(1, this.pageSize)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onSetRemoved(id: string) {
    this.mySetsService.removeMySet(id, this.currentPage, this.pageSize)
  }
}
