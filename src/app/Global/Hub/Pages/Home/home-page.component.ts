import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
  standalone: true,
  imports: [RouterLink]
})
export class HomePageComponent {}
