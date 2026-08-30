import { Component, Input } from '@angular/core';
import Answer from '../../../../Models/Answer';
import { Store } from '@ngrx/store';
import { finishStudying } from '../../../../Redux/Actions/set-study.actions';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { ResultComponent } from '../Result/result.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'results',
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.scss'],
  standalone: true,
  imports: [NgFor, ResultComponent, MatButton]
})
export class ResultsComponent {
  @Input() results!: Answer[];

  constructor(
    private store: Store,
    private router: Router
  ) {}

  async onFinishClicked() {
    await this.router.navigate(['hub', 'my-sets']);
    this.store.dispatch(finishStudying());
  }
}
