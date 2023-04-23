import {Component, Input} from '@angular/core';

@Component({
  selector: 'terms-step',
  templateUrl: './terms-step.component.html',
  styleUrls: ['./terms-step.component.css']
})
export class TermsStepComponent {
  isUserAgreed: boolean
  isCheckboxError: boolean
  @Input("isLoading") isLoading: boolean = false

  constructor() {
    this.isUserAgreed = false
    this.isCheckboxError = false
  }

  onCheckboxClicked() {
    this.isUserAgreed = !this.isUserAgreed
    this.isCheckboxError = false
  }

}
