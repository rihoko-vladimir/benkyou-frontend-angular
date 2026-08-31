import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class HomePageComponent {}
