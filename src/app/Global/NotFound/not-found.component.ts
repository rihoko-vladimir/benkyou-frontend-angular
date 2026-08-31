import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: 'not-found.component.html',
  styleUrls: ['not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class NotFoundComponent {}
