import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [],
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  exports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue:
      { displayDefaultIndicatorType: false }
  }]
})

export class MaterialModule {}
