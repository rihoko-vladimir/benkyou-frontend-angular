import {Component} from "@angular/core";
import {Store} from "@ngrx/store";
import Kanji from "../../../../Models/Kanji";
import {AppState} from "../../../../Redux/app.state";
import {Observable} from "rxjs";

@Component({
  selector: "study-page",
  templateUrl: "study-page.component.html",
  styleUrls: ["study-page.component.css"]
})

export class StudyPageComponent {
  kanjiListObservable: Observable<Kanji[]>
  kanjiList: Kanji[]
  currentIndex: number
  currentKanji: Kanji

  constructor(private store: Store<AppState>) {
    this.kanjiList = [
      new Kanji("K",
        ["g", "m"],
        ["f", "h"])]
    this.currentIndex = 0
    this.kanjiListObservable = store.select(state => state.setStudy.kanjiList)
    this.currentKanji = this.kanjiList[this.currentIndex]
  }

}
