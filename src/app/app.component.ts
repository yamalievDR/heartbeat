import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Observable, Subject } from 'rxjs';
import { HeartBeatService } from './heartbeat.service';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('running', [
      state(
        'true',
        style({
          animation: 'pulse {{animateTime}}ms infinite'
        }),
        { params: { animateTime: 1000 } }
      ),
      state(
        'false',
        style({
          animation: 'none'
        })
      )
    ])
  ]
})
export class AppComponent implements OnInit {
  running = false;
  animateTime$: Observable<number>;
  bpm$: Observable<any>;

  constructor(private heartBeatService: HeartBeatService) {}

  ngOnInit(): void {
    this.bpm$ = this.heartBeatService.getBPM().pipe(filter(() => this.running));
    this.animateTime$ = this.heartBeatService.getFrequency();
    this.setFrequency(1000);
  }

  setFrequency(val: number) {
    this.heartBeatService.setFrequency(val);
  }
}
