import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { Observable, fromEvent } from 'rxjs';
import { HeartBeatService } from './heartbeat.service';
import { filter, map } from 'rxjs/operators';
import { roundNumber } from './utils/round-number';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('running', [
      state(
        'true',
        style({
          animation: 'beat {{animateTime}}ms infinite'
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
export class AppComponent implements OnInit, AfterViewInit {
  running = false;
  animateTime$: Observable<number>;
  bpm$: Observable<any>;

  @ViewChild('freqSelector', { static: true }) freqSelector: ElementRef;

  constructor(private heartBeatService: HeartBeatService) {}

  ngOnInit(): void {
    this.bpm$ = this.heartBeatService.getBPM().pipe(filter(() => this.running));
    this.animateTime$ = this.heartBeatService.getFrequency();
    this.setFrequency(1000);
  }

  ngAfterViewInit() {
    this.freqSelector.nativeElement.value = 10;
    fromEvent(this.freqSelector.nativeElement, 'change')
      .pipe(map(() => this.freqSelector.nativeElement.value))
      .subscribe(value => this.setFrequency(roundNumber(100 * value)));
  }
  setFrequency(val: number) {
    this.heartBeatService.setFrequency(val);
  }
}
