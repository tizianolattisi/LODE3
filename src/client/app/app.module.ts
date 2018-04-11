import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LectureListComponent } from './lecture-list/lecture-list.component';
import { StoreModule } from './store/store.module';
import { ServiceModule } from './service/service.module';
import { NoteSliderComponent } from './video/note-slider/note-slider.component'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    SharedModule.forRoot(),
    StoreModule,
    ServiceModule.forRoot()
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomePageComponent,
    LectureListComponent
  ],
  entryComponents: [
    NoteSliderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
