import { BehaviorSubject, concat, Observable, of } from "rxjs";
import { catchError, map, switchMap, endWith } from "rxjs/operators";
import {
  COMPLETE,
  ErrorState,
  IDLE,
  LoadState,
  PENDING,
  NgxLoadModuleConfig,
} from "./ngx-load.model";

export class ObservableState<ObservableType = unknown> {
  constructor(private config: NgxLoadModuleConfig) {}

  private observable$ = new BehaviorSubject<
    Observable<ObservableType> | null | undefined
  >(null);

  observe(): Observable<LoadState<ObservableType>> {
    return this.observable$.pipe(
      switchMap((currentObservable) =>
        this.observableToLoadState(currentObservable)
      )
    );
  }

  private observableToLoadState(
    observable: Observable<ObservableType> | null | undefined
  ): Observable<LoadState<ObservableType>> {
    try {
      if (observable == null) {
        return of(IDLE);
      }
      const loader$ = this.loadObservable(observable);
      return concat(of(PENDING), loader$);
    } catch (error) {
      this.config.errorLogger(error);
      return of({ state: error, value: error } as ErrorState);
    }
  }

  private loadObservable(observable: Observable<ObservableType>) {
    return observable.pipe(
      map<ObservableType, LoadState<ObservableType>>((value) =>
        this.config.emptyCheck(value)
          ? { state: "empty", value: value }
          : { state: "value", value: value }
      ),
      endWith(COMPLETE),
      catchError<LoadState<ObservableType>, Observable<ErrorState>>((error) => {
        this.config.errorLogger(error);
        return of<ErrorState>({ state: "error", value: error });
      })
    );
  }

  next(observable: Observable<ObservableType> | null | undefined) {
    this.observable$.next(observable);
  }

  current() {
    return this.observable$.value;
  }

  destroy() {
    this.observable$.complete();
  }
}
