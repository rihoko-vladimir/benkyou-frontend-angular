import { Component, Input } from '@angular/core';

@Component({
  selector: 'readings-container',
  templateUrl: 'readings-container.component.html',
  styleUrls: ['readings-container.component.scss']
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
