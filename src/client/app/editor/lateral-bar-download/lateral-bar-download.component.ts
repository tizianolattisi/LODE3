import {Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app-state';
import {DownloadPdf} from '../../store/lecture/lecture.actions';
import {Observable} from 'rxjs/Observable';
import {ErrorResponse} from '../../service/model/error-response';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'l3-lateral-bar-download',
  templateUrl: './lateral-bar-download.component.html',
  styleUrls: ['./lateral-bar-download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateralBarDownloadComponent implements OnInit, OnDestroy {

  pending = false;

  success$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  private pendingSubscr: Subscription;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.pendingSubscr = this.store.select(s => s.lecture.dowloadPdfPending).subscribe(pending => {
      this.pending = pending;
      this.cd.detectChanges();
    });

    this.success$ = this.store.select(s => s.lecture.dowloadPdfSuccess);
    this.error$ = this.store.select(s => s.lecture.dowloadPdfError);
  }

  onDownload() {
    this.store.dispatch(new DownloadPdf());
  }

  ngOnDestroy() {
    this.pendingSubscr.unsubscribe();
  }
}
