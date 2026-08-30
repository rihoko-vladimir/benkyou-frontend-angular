import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'result-reading',
  templateUrl: 'result-reading.component.html',
  styleUrls: ['result-reading.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class ResultReadingComponent {
  @Input() reading: string = '';
  @Input() type: string = ReadingType.incorrect;
}

export enum ReadingType {
  correct = 'correct',
  required = 'required',
  incorrect = 'incorrect'
}
