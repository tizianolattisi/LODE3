import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routing';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {MaterialModule} from './material/material.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LectureListComponent} from './lecture-list/lecture-list.component';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    SharedModule.forRoot() // TODO put something in it?
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomePageComponent,
    LectureListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
