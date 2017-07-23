import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FxFullHeightDirective} from './fx-full-height.directive';
import {FxFullWidthDirective} from './fx-full-width.directive';
import {
  MdButtonModule,
  MdIconModule,
  MdCardModule,
  MdToolbarModule,
  MdInputModule,
  MdListModule
} from '@angular/material';

@NgModule({
  imports: [
    FlexLayoutModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdToolbarModule,
    MdInputModule,
    MdListModule
  ],
  exports: [
    FlexLayoutModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdToolbarModule,
    MdInputModule,
    MdListModule,
    FxFullHeightDirective,
    FxFullWidthDirective
  ],
  declarations: [
    FxFullHeightDirective,
    FxFullWidthDirective
  ]
})
export class MaterialModule {}
