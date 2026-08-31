import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectSetStudy } from '../../../../Redux/Selectors/selectors';
import { setStudyInitialState } from '../../../../Redux/Reducers/set-study.reducer';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { nextKanji } from '../../../../Redux/Actions/set-study.actions';
import Answer from '../../../../Models/Answer';
import { ResultsComponent } from '../../Components/ResultsComponent/results.component';
import { MatButton } from '@angular/material/button';
import { KanjiSvgDrawingPreviewComponent } from '../../Components/KanjiSvgDrawingPreview/kanji-svg-drawing-preview.component';

import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-study-page',
  templateUrl: 'study-page.component.html',
  styleUrls: ['study-page.component.scss'],
  imports: [MatCard, KanjiSvgDrawingPreviewComponent, CdkDropList, CdkDrag, MatButton, ResultsComponent]
})
export class StudyPageComponent {
  private store = inject<Store<AppState>>(Store);

  // Zoneless prep (commit A): the study slice is read-only in this
  // component — computed signals. The three reading arrays are writable
  // signals because CDK drag-drop mutates them in place; drop() writes
  // back fresh references so zoneless change detection gets scheduled.
  private studyState = toSignal(this.store.select(selectSetStudy), { initialValue: setStudyInitialState });
  currentAllReadings = signal<string[]>([]);
  selectedKunyomiReadings = signal<string[]>([]);
  selectedOnyomiReadings = signal<string[]>([]);
  currentKanji = computed(() => this.studyState().currentKanji);
  length = computed(() => this.studyState().length);
  currentIndex = computed(() => this.studyState().currentStep);
  answers = computed(() => this.studyState().answerList);

  constructor() {
    effect(() => this.currentAllReadings.set([...this.studyState().currentRandomReadings]));
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    // CDK mutated the arrays in place; copy to new references so the
    // signals change and zoneless change detection is scheduled.
    this.currentAllReadings.update(readings => [...readings]);
    this.selectedKunyomiReadings.update(readings => [...readings]);
    this.selectedOnyomiReadings.update(readings => [...readings]);
  }

  onNextClicked() {
    const answer = new Answer(this.currentKanji(), this.selectedKunyomiReadings(), this.selectedOnyomiReadings());
    if (!(this.answers().length === this.length())) {
      this.store.dispatch(nextKanji({ answer: answer }));
      this.selectedKunyomiReadings.set([]);
      this.selectedOnyomiReadings.set([]);
    }
    return;
  }
}
