import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FxFullHeightDirective} from './fx-full-height.directive';
import {FxFullWidthDirective} from './fx-full-width.directive';
import {
  MdButtonModule,
  MdIconModule,
  MdCardModule,
  MdToolbarModule,
  MdInputModule,
  MdListModule,
  MdExpansionModule,
  MdProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [
    HttpModule,
    FlexLayoutModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdToolbarModule,
    MdInputModule,
    MdListModule,
    MdExpansionModule,
    MdProgressSpinnerModule
  ],
  exports: [
    FlexLayoutModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdToolbarModule,
    MdInputModule,
    MdListModule,
    MdExpansionModule,
    MdProgressSpinnerModule,
    FxFullHeightDirective,
    FxFullWidthDirective
  ],
  declarations: [
    FxFullHeightDirective,
    FxFullWidthDirective
  ]
})
export class MaterialModule {}
