import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectorComponent } from './projector/projector.component';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [ProjectorComponent]
})
export class LecturerModule { }
