import {Component, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import Kanji from "../../../../Models/Kanji";
import {AppState} from "../../../../Redux/app.state";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {nextKanji} from "../../../../Redux/Actions/set-study.actions";
import Answer from "../../../../Models/Answer";

@Component({
  selector: "study-page",
  templateUrl: "study-page.component.html",
  styleUrls: ["study-page.component.css"]
})

export class StudyPageComponent implements OnDestroy {
  subscription
  currentAllReadings: string[] = []
  currentKanji: Kanji = new Kanji()
  selectedKunyomiReadings: string[] = []
  selectedOnyomiReadings: string[] = []
  length: number = 0
  currentIndex: number = 0
  answers: Answer[] = []

  constructor(private store: Store<AppState>) {
    this.subscription = store.select("setStudy").subscribe(value => {
      this.currentAllReadings = [...value.currentRandomReadings]
      this.currentKanji = value.currentKanji
      this.length = value.length
      this.currentIndex = value.currentStep
      this.answers = value.answerList
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex)
  }

  onNextClicked() {
    let answer = new Answer(this.currentKanji, this.selectedKunyomiReadings, this.selectedOnyomiReadings)
    this.store.dispatch(nextKanji({answer: answer}))
    this.selectedKunyomiReadings = []
    this.selectedOnyomiReadings = []
    return
  }
}
