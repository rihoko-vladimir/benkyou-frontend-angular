import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import Kanji from '../../../../Models/Kanji';
import AppState from '../../../../Redux/app.state';
import { selectSetStudy } from '../../../../Redux/Selectors/selectors';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { nextKanji } from '../../../../Redux/Actions/set-study.actions';
import Answer from '../../../../Models/Answer';
import { ResultsComponent } from '../../Components/ResultsComponent/results.component';
import { MatButton } from '@angular/material/button';
import { KanjiSvgDrawingPreviewComponent } from '../../Components/KanjiSvgDrawingPreview/kanji-svg-drawing-preview.component';
import { NgIf, NgFor } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'study-page',
  templateUrl: 'study-page.component.html',
  styleUrls: ['study-page.component.scss'],
  standalone: true,
  imports: [MatCard, NgIf, KanjiSvgDrawingPreviewComponent, CdkDropList, NgFor, CdkDrag, MatButton, ResultsComponent]
})
export class StudyPageComponent implements OnDestroy {
  subscription;
  currentAllReadings: string[] = [];
  currentKanji: Kanji = new Kanji();
  selectedKunyomiReadings: string[] = [];
  selectedOnyomiReadings: string[] = [];
  length: number = 0;
  currentIndex: number = 0;
  answers: Answer[] = [];

  constructor(private store: Store<AppState>) {
    this.subscription = store.select(selectSetStudy).subscribe(value => {
      this.currentAllReadings = [...value.currentRandomReadings];
      this.currentKanji = value.currentKanji;
      this.length = value.length;
      this.currentIndex = value.currentStep;
      this.answers = value.answerList;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  }

  onNextClicked() {
    const answer = new Answer(this.currentKanji, this.selectedKunyomiReadings, this.selectedOnyomiReadings);
    if (!(this.answers.length === this.length)) {
      this.store.dispatch(nextKanji({ answer: answer }));
      this.selectedKunyomiReadings = [];
      this.selectedOnyomiReadings = [];
    }
    return;
  }
}
