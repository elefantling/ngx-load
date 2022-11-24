import { InjectionToken, TemplateRef } from "@angular/core";
import { isEmpty } from "./ngx-load.utils";

export type InitState = { state: "init" };
export type IdleState = { state: "idle" };
export type PendingState = { state: "pending" };
export type EmptyState = { state: "empty"; value: unknown };
export type ErrorState = { state: "error"; value: unknown };
export type CompleteState = { state: "complete" };
export type ValueState<Type = unknown> = { state: "value"; value: Type };
export type LoadState<Type = unknown> =
  | InitState
  | CompleteState
  | IdleState
  | EmptyState
  | ErrorState
  | PendingState
  | ValueState<Type>;

export const INIT: InitState = { state: "init" };
export const IDLE: IdleState = { state: "idle" };
export const PENDING: PendingState = { state: "pending" };
export const COMPLETE: CompleteState = { state: "complete" };

export type LoadStateWithTemplate<Type = unknown> = LoadState<Type> & {
  template: TemplateRef<unknown> | undefined | null;
};

export type NgxLoadModuleConfig = {
  logErrors: boolean;
  emptyCheck: (x: unknown) => boolean;
  errorLogger: (x: unknown) => void;
};

export const DEFAULT_CONFIG: NgxLoadModuleConfig = {
  logErrors: true,
  emptyCheck: isEmpty,
  errorLogger: (error) => console.error(error),
};

export const NGX_LOAD_CONFIG: InjectionToken<NgxLoadModuleConfig> = new InjectionToken<
  NgxLoadModuleConfig
>("Configuration for @elefantling/ngx-load", {
  providedIn: "root",
  factory: () => DEFAULT_CONFIG,
});
