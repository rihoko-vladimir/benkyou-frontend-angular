import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Kanji from '../../../../../Models/Kanji';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'edit-kanji-list',
  templateUrl: 'edit-kanji-list.component.html',
  styleUrls: ['edit-kanji-list.component.css'],
  animations: [
    trigger('parentEnter', [transition(':enter', [query('@enterRemoveAnim', stagger('100ms', animateChild()))])]),
    trigger('enterRemoveAnim', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('200ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate(
          '200ms ease-in-out',
          style({
            transform: 'scale(0.5)',
            opacity: 0,
            height: '0px',
            margin: '0px'
          })
        )
      ])
    ])
  ]
})
export class EditKanjiListComponent {
  @Input() kanjiList!: Kanji[];
  @Output() kanjiListChange = new EventEmitter<Kanji[]>();
  @ViewChild('list') list!: ElementRef;

  onAddNewKanjiClicked() {
    this.kanjiList.push(new Kanji());
  }

  onRemoveKanji(index: number) {
    this.kanjiList.splice(index, 1);
  }

  onKanjiChanged(object: { kanji: Kanji; index: number }) {
    this.kanjiList[object.index] = object.kanji;
    this.kanjiListChange.emit(this.kanjiList);
  }
}
