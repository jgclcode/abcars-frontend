import { NgModule } from '@angular/core';

// Providers
import { MAT_DATE_LOCALE } from '@angular/material/core';

// Modules Angular Material
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatCardModule as MatCardModule } from '@angular/material/card';
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule as MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatListModule as MatListModule } from '@angular/material/list';
import { MatMenuModule as MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule as MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule as MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule as MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule as MatTableModule } from '@angular/material/table';
import { MatTabsModule as MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule as MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Carousel Module
import { IvyCarouselModule } from 'angular14-responsive-carousel';

@NgModule({
  exports: [
    ClipboardModule,
    IvyCarouselModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})

export class AngularMaterialModule { }
