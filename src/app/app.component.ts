import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountDownTimerComponent } from './controls/count-down-timer/count-down-timer.component';
import { SwPush } from '@angular/service-worker';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {


  @ViewChild(CountDownTimerComponent) countDownTimer: CountDownTimerComponent;


  public pomodoroTime = 15;
  public shortBreakTime = 300;
  public longBreakTime = 1200;
  public pomodoroLimit = 4;
  public pomodoroCount = 0;
  public rainAudioSource = "/assets/sounds/light-rain.mp3";
  public dingAudioSource = "/assets/sounds/ding.mp3"
  public isTimerStarted: boolean = false;
  public audio = null;
  public rainyDay = null;
  public timeLimit;
  public isOnPomodoroBreak = false;
  public isEnabled = this.swPush.isEnabled;
  public isGranted = Notification.permission === 'granted';


  constructor(private cdr: ChangeDetectorRef, private swPush: SwPush) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.pomodoroSteper();
    this.countDownTimer.onTimerEnd().subscribe(() => {
      this.isOnPomodoroBreak = (this.timeLimit === this.pomodoroTime);
      this.pomodoroSteper();
      this.stopTimer();
      this.startAudio(this.dingAudioSource, false);
    });
  }

  public pomodoroSteper() {
    if (!this.isOnPomodoroBreak) {
      this.pomodoroCount++;
      this.timeLimit = this.pomodoroTime;
    } else {
      if (this.pomodoroCount == 4) {
        this.timeLimit = this.longBreakTime;
      } else {
        this.timeLimit = this.shortBreakTime;
      }
    }

    this.countDownTimer.timeLimit = this.timeLimit;
    this.cdr.detectChanges();
  }

  public startTimer() {
    this.countDownTimer.startTimer();
    this.startAudio(this.rainAudioSource, true);
    this.isTimerStarted = true;
  }

  public stopTimer() {
    this.countDownTimer.stopTimer();
    this.audio.pause();
    this.audio = null;
    this.isTimerStarted = false;
  }

  public startAudio(audioSource, isLoop) {
    this.audio = new Audio(audioSource)
    this.audio.load();
    this.audio.loop = isLoop;
    this.audio.play();
  }
}
