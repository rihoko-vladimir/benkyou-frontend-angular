import {NgModule} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatBadgeModule} from "@angular/material/badge";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatChipsModule} from "@angular/material/chips";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [],
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    DragDropModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDatepickerModule
  ],
  exports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    DragDropModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatBadgeModule
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue:
      {displayDefaultIndicatorType: false}
  }]
})

export class MaterialModule {
}
