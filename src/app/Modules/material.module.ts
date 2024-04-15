import {NgModule} from "@angular/core";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatLegacySnackBarModule as MatSnackBarModule} from "@angular/material/legacy-snack-bar";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyChipsModule as MatChipsModule} from "@angular/material/legacy-chips";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatBadgeModule} from "@angular/material/badge";

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
