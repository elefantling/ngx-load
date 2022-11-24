import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import {
  concat,
  EMPTY,
  interval,
  Observable,
  of,
  ReplaySubject,
  Subject,
  take,
  throwError,
} from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  ok$ = of("ok");
  empty$ = of("");
  error$ = throwError("thrown error");
  null$ = null;
  pending$ = EMPTY;
  idle$ = null;
  test$: Observable<number> | null = null;
  observable$: Subject<number> | null = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.test$ = concat(
        interval(1000).pipe(take(5)),
        throwError(() => "error reached")
      );
      this.changeDetector.detectChanges();
    }, 1000);
  }

  idle() {
    this.observable$ = null;
  }

  pending() {
    this.observable$ = new ReplaySubject(1);
    this.observable$ = new Subject();
  }

  empty() {
    this.observable$?.next(0);
  }

  value() {
    this.observable$?.next(Math.random());
  }

  error() {
    this.observable$?.error("An error occured");
  }

  complete() {
    this.observable$?.complete();
  }

  detect() {
    this.changeDetector.detectChanges();
  }
}
