import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HeartBeatService } from './heartbeat.service';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  running = false;

  pulse = false; // TODO: animation

  bpm$: Observable<any>;
  private destroy$ = new Subject<void>();

  constructor(private heartBeatService: HeartBeatService) {}

  ngOnInit(): void {
    this.bpm$ = this.heartBeatService.getBPM().pipe(filter(() => this.running));

    this.heartBeatService
      .getRRS()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.pulse = !this.pulse));
  }

  setFrequency(val: number) {
    this.heartBeatService.setFrequency(val);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
