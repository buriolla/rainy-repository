import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-count-down-timer',
  templateUrl: './count-down-timer.component.html',
  styleUrls: ['./count-down-timer.component.scss']
})
export class CountDownTimerComponent implements AfterViewInit {

  @Input() timeLimit: any;

  private timerEndSubject = new Subject<any>();
  private componentLoadedSubject = new Subject();
  public readonly FULL_DASH_ARRAY = 283;
  public readonly WARNING_THRESHOLD = 10;
  public readonly ALERT_THRESHOLD = 5;
  public readonly COLOR_CODES = {
    info: {
      color: "green"
    },
    warning: {
      color: "orange",
      threshold: this.WARNING_THRESHOLD
    },
    alert: {
      color: "red",
      threshold: this.ALERT_THRESHOLD
    }
  };

  public timePassed = 0;
  public timeLeft = null;
  public timerInterval = null;
  public remainingPathColor = this.COLOR_CODES.info.color;
  public circleDasharray: any = 283;
  public isTimerStarted: boolean = false;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.timeLeft = this.timeLimit;
  }

  public onTimesUp() {
    clearInterval(this.timerInterval);
  }

  public onTimerEnd() : Observable<any> {
    return this.timerEndSubject.asObservable();
  }

  public onTimerLoaded() : Observable<any> {
    return this.componentLoadedSubject.asObservable();
  }

  public startTimer() {
    this.timerInterval = setInterval(() => {
      this.isTimerStarted = true;
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.timeLimit - this.timePassed;
      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);
      if (this.timeLeft === 0) {
        this.isTimerStarted = false;
        this.onTimesUp();
        this.timerEndSubject.next();
      }
    }, 1000);
  }

  stopTimer() {
    this.onTimesUp();
    this.timePassed = 0;
    this.timeLeft = this.timeLimit;
    this.timerInterval = null;
    this.remainingPathColor = this.COLOR_CODES.info.color;
    this.circleDasharray = 283;
    this.isTimerStarted = false;
  }

  public formatTime(time) {
    if(time > 0) {
      const minutes = Math.floor(time / 60);
      let seconds: any = time % 60;
  
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
  
      return `${minutes}:${seconds}`;
    } else {
      return "00:00"
    }
  }

  public setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = this.COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      this.remainingPathColor = alert.color;

    } else if (timeLeft <= warning.threshold) {
      this.remainingPathColor = warning.color;
    }
  }

  public calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.timeLimit;
    return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
  }

  public setCircleDasharray() {
    this.circleDasharray = (this.calculateTimeFraction() * this.FULL_DASH_ARRAY).toFixed(0) + ' 283';
  }
}
