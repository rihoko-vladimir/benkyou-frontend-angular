import {Component, OnDestroy, OnInit} from "@angular/core";
import Set from "../../../../Models/Set"
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {DialogProperties, OpenMode, SetDialogComponent} from "../../Components/SetDialog/set-dialog.component";
import {Store} from "@ngrx/store";
import AppState from "../../../../Redux/app.state";
import {MySetsService} from "../../../../Services/my-sets.service";
import {LegacyPageEvent as PageEvent} from "@angular/material/legacy-paginator";

@Component({
  selector: "my-sets-page",
  templateUrl: "my-sets.component.html",
  styleUrls: ["my-sets.component.css"]
})

export class MySetsComponent implements OnInit, OnDestroy {
  sets: Set[] = []
  currentPage: number = 0
  pageSize: number = 9
  pagesCount: number = 1
  subscription
  isLoading: boolean = false
  isError : boolean = false

  constructor(private dialog: MatDialog, private store: Store<AppState>, private mySetsService: MySetsService) {
    this.subscription = store.select("mySets").subscribe(value => {
      this.pagesCount = value.pagesCount
      this.pageSize = value.setsCount
      this.sets = value.sets
      this.isLoading = false
      this.isError = value.errorMessage !== undefined
      this.currentPage = value.currentPage - 1
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
    this.isLoading = true
    this.mySetsService.getMySets(1, this.pageSize)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onSetRemoved(id: string) {
    this.mySetsService.removeMySet(id, this.currentPage + 1, this.pageSize)
  }

  onSetChanged(changesObj: { set: Set, originalSet: Set }) {
    this.mySetsService.patchMySet(changesObj.set.id, changesObj.set, changesObj.originalSet)
  }

  onRetryClicked() {
    this.isLoading = true
    this.mySetsService.getMySets(1, this.pageSize)
  }

  onPageChanged(event: PageEvent) {
    this.isLoading = true
    this.mySetsService.getMySets(event.pageIndex + 1, this.pageSize)
  }
}
