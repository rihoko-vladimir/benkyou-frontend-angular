import { Component, Input } from '@angular/core';
import { SpeechableReadingComponent } from '../SpeechableReading/speechable-reading.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'readings-container',
  templateUrl: 'readings-container.component.html',
  styleUrls: ['readings-container.component.scss'],
  imports: [NgFor, SpeechableReadingComponent]
})
export class ReadingsContainerComponent {
  @Input() readings: string[] = [
    '死',
    'b',
    'c',
    'a',
    'b',
    'c',
    'a',
    'b',
    'c',
    '漢字',
    'b',
    'c',
    '母',
    'b',
    'c',
    'a',
    'b',
    'c',
    'a',
    'b',
    'c',
    'a',
    'b',
    'c',
    'a',
    'b',
    'c'
  ];
}
