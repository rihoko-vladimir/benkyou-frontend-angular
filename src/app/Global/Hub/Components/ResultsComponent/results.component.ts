import { Component, Input } from '@angular/core';
import Answer from '../../../../Models/Answer';
import { Store } from '@ngrx/store';
import { finishStudying } from '../../../../Redux/Actions/set-study.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'results',
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.scss']
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
