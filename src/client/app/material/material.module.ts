import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FxFullHeightDirective } from './fx-full-height.directive';
import { FxFullWidthDirective } from './fx-full-width.directive';
import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatInputModule,
  MatListModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatMenuModule,
  MatSliderModule,
  MatButtonToggleModule
} from '@angular/material';

@NgModule({
  imports: [
    HttpModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSliderModule,
    MatButtonToggleModule
  ],
  exports: [
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FxFullHeightDirective,
    FxFullWidthDirective,
    MatSnackBarModule,
    MatMenuModule,
    MatSliderModule,
    MatButtonToggleModule
  ],
  declarations: [
    FxFullHeightDirective,
    FxFullWidthDirective
  ]
})
export class MaterialModule { }
