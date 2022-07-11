import {Component, OnDestroy, OnInit} from "@angular/core";
import Set from "../../../../Models/Set"
import {Store} from "@ngrx/store";
import AppState from "../../../../Redux/app.state";
import {AllSetsService} from "../../../../Services/all-sets.service";

@Component({
  selector: "all-sets-page",
  templateUrl: "all-sets.component.html",
  styleUrls: ["all-sets.component.css"]
})

export class AllSetsComponent implements OnDestroy, OnInit {
  currentSets: Set[] = []
  setCount : number = 0
  pagesCount : number = 1
  currentPage : number = 1
  subscription

  constructor(private store: Store<AppState>, private allSetsService : AllSetsService) {
    this.subscription = store.select("allSets").subscribe(value =>{
      this.currentSets = value.sets
      this.setCount = value.setsCount
      this.currentPage = value.currentPage
      this.pagesCount = value.pagesCount
    })
  }

  ngOnInit(): void {
    this.allSetsService.getAllSets(this.currentPage, this.setCount)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe
  }
}
