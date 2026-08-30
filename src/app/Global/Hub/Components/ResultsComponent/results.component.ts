import { Component, Input, inject } from '@angular/core';
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
  imports: [NgFor, ResultComponent, MatButton]
})
export class ResultsComponent {
  private store = inject(Store);
  private router = inject(Router);

  @Input() results!: Answer[];

  async onFinishClicked() {
    await this.router.navigate(['hub', 'my-sets']);
    this.store.dispatch(finishStudying());
  }
}
