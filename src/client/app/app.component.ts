import { Lecture } from './service/model/lecture';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IconService } from './shared/icon.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app-state';
import { Observable } from 'rxjs/Observable';
import { SetVideoLayout } from './store/video/video.actions'
import { Layout } from './store/video/video.state'
import { NoteSliderComponent } from './video/note-slider/note-slider.component'
import { InfoDialogComponent } from './shared/info-dialog/info-dialog.component'
import { MatDialog } from '@angular/material';
import * as UserActions from './store/user/user.actions';

@Component({
  selector: 'l3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  email$: Observable<string>;
  currentLecture$: Observable<Lecture>;
  isInViewer: boolean
  has3Stream: boolean = true
  isCollapsed: boolean = false

  @ViewChild('header') header: ElementRef;

  constructor(private iconService: IconService,
    private store: Store<AppState>,
    private router: Router,
    public slideDialog: MatDialog) { }

  ngOnInit() {
    this.iconService.init();

    // Try to load token from local storage
    this.store.dispatch(new UserActions.LoadToken());

    // Collect current logged user data (email)
    this.email$ = this.store.select(s => s.user.email);
    // Current edited/viewed lecture
    this.currentLecture$ = this.store.select(s => s.lecture.currentLecture);

    // Verify if user is in the viewer
    this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.isInViewer = (data !== Layout.NONE)
      if (data === Layout.LINEAR2 || data === Layout.TABULAR2)
        this.has3Stream = false
      if (this.isInViewer) {
        this.isCollapsed = false
        this.collapseNavbar()
      } else {
        this.isCollapsed = true
        this.collapseNavbar()
      }
    })
  }

  collapseNavbar() {
    this.isCollapsed = !this.isCollapsed
    if (this.isCollapsed) {
      this.header.nativeElement.style.marginRight = '95vw'
    } else {
      this.header.nativeElement.style.marginRight = '0'
    }

  }

  onLogout() {
    this.store.dispatch(new UserActions.Logout());
    this.router.navigate(['/']);
  }

  showSlides() {
    this.slideDialog.open(NoteSliderComponent, {
      width: '100vw'
    })
  }

  showInfo() {
    this.slideDialog.open(InfoDialogComponent, {
      width: '100vw',
      data: {
        title: 'About Lode',
        content: "  Lode (Lectures On DEmand) è un software di acquisizione e riproduzione di videolezioni sviluppato da " +
          "<a href='http://latemar.science.unitn.it'>Marco Ronchetti</a> e collaboratori presso l'Università degli Studi di Trento." +
          "<br/> Per dettagli si veda <a href='http://latemar.science.unitn.it/LODE'>il sito del progetto</a>"
      }

    })
  }

  showHelp() {
    this.slideDialog.open(InfoDialogComponent, {
      width: '100vw',
      data: {
        title: 'Utilizzo del player',
        content: "Il video può essere controllato dai pulsanti posizionati sotto lo stesso, che permettono di avviare/fermare la riproduzione," +
          "modificare la velocità (1x, 1.3x, 2x), escludere l'audio, saltare indietro o in avanti di 10 secondi." +
          "<br/> Il layout può essere modificato con i pulsanti sulla barra soprastante, mostrando i due stream video con" +
          " la stessa dimensione, oppure visualizzando uno stream principale più grande." +
          "<br/> La barra di avanzamento riporta la posizione corrente nel video."
      }
    })
  }

  changeVideoLayout(current: string) {
    this.store.dispatch(new SetVideoLayout(Layout[current]))
  }
}
