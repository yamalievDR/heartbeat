import { Injectable } from '@angular/core';
import { Observable, timer, Subject, BehaviorSubject } from 'rxjs';
import {
  map,
  startWith,
  pairwise,
  tap,
  concatMapTo,
  scan,
  auditTime,
  switchMap
} from 'rxjs/operators';
import { randomize } from './utils/randomize';
import { roundNumber } from './utils/round-number';
export const ONE_MINUTE = 60 * 1000;

@Injectable({ providedIn: 'root' })
export class HeartBeatService {
  bufferSize = 10;

  rrs$ = new Subject();
  frequency$ = new BehaviorSubject<number>(1000);

  getFrequency = () => this.frequency$.asObservable();
  getRRS = () => this.rrs$.asObservable();

  getRRSArray = () =>
    this.getRRS().pipe(
      scan((acc, cur) => [...acc, cur], []),
      map(arr => arr.slice(Math.max(arr.length - this.bufferSize, 1)))
    );

  getTimings() {
    return this.getFrequency().pipe(
      switchMap(time =>
        timer(0, time).pipe(
          map(() => new Date().getTime()),
          map(randomize)
        )
      )
    );
  }

  getBPM(): Observable<number> {
    const mlsc$ = this.getTimings();

    const interval$ = mlsc$.pipe(
      startWith(0),
      pairwise(),
      tap(([last, current]) => this.rrs$.next(current - last))
    );

    const rrIntervals$ = interval$.pipe(
      startWith([]),
      concatMapTo(this.getRRSArray())
    );

    return rrIntervals$.pipe(
      map(arr => {
        const sum: number = arr.reduce((acc, value) => acc + value, 0);
        const avg = sum / arr.length;
        return roundNumber(avg, 3);
      }),
      map(rr => roundNumber(ONE_MINUTE / rr)),
      auditTime(1000)
    );
  }

  setFrequency(value: number) {
    this.frequency$.next(value);
  }
}
