import {
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  INIT,
  LoadState,
  NgxLoadModuleConfig,
  NGX_LOAD_CONFIG,
} from './ngx-load.model';
import { ObservableState } from './observable-state';

type Templates = {
  init?: TemplateRef<unknown>;
  empty?: TemplateRef<unknown>;
  error?: TemplateRef<unknown>;
  idle?: TemplateRef<unknown>;
  pending?: TemplateRef<unknown>;
  complete?: TemplateRef<unknown>;
  value?: TemplateRef<unknown>;
};
type TemplateNames = keyof Templates;
/**
 * This directive takes an observable as implicit argument.
 */
@Directive({
  selector: '[ngxLoad]',
})
export class NgxLoadDirective implements OnInit, OnDestroy {
  state$ = new ObservableState(this.config);
  view: EmbeddedViewRef<unknown> | null = null;
  context: { $implicit?: unknown } = {};
  subscriptions: Subscription[] = [];
  template: TemplateNames = 'init';
  templates: Templates = {};

  @Input()
  set ngxLoad(observable: Observable<unknown> | undefined | null) {
    this.state$.next(observable);
  }

  @Input()
  set ngxLoadEmpty(template: TemplateRef<unknown> | undefined | null) {
    this.updateTemplates('empty', template);
  }

  @Input()
  set ngxLoadError(template: TemplateRef<unknown> | undefined | null) {
    this.updateTemplates('error', template);
  }

  @Input()
  set ngxLoadIdle(template: TemplateRef<unknown> | undefined | null) {
    this.updateTemplates('idle', template);
  }

  @Input()
  set ngxLoadPending(template: TemplateRef<unknown> | undefined | null) {
    this.updateTemplates('pending', template);
  }

  @Input()
  set ngxLoadComplete(template: TemplateRef<unknown> | undefined | null) {
    this.updateTemplates('complete', template);
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private changeDetector: ChangeDetectorRef,
    valueTemplate: TemplateRef<unknown>,
    @Inject(NGX_LOAD_CONFIG) private config: NgxLoadModuleConfig
  ) {
    this.updateTemplates('value', valueTemplate);
  }

  ngOnInit() {
    this.subscriptions.push(this.subscribeToState());
  }

  private subscribeToState(): Subscription {
    return this.state$
      .observe()
      .pipe(startWith<LoadState>(INIT))
      .subscribe((newState) => {
        this.updateState(newState);
      });
  }

  updateState(newState: LoadState) {
    if (newState.state === 'complete' && this.templates['complete'] == null) {
      // ignore complete if no template for it is present
      return;
    }
    this.context = this.contextFromState(newState);
    const desiredTemplate = this.findTemplate(newState.state);

    if (desiredTemplate !== this.template) {
      this.template = desiredTemplate;
      this.updateTemplate();
    } else {
      if (this.view != null) {
        this.view.context = this.context;
        this.changeDetector.detectChanges();
      }
    }
  }

  updateTemplates(
    name: TemplateNames,
    valueTemplate: TemplateRef<unknown> | null | undefined
  ) {
    this.templates[name] = valueTemplate ?? undefined;
    if (this.template === name) {
      this.updateTemplate();
    }
  }

  updateTemplate() {
    if (this.view != null) {
      this.view = null;
      this.viewContainer.clear();
    }
    const template = this.templates[this.template];
    if (template != null) {
      this.view = this.viewContainer.createEmbeddedView(template, this.context);
      this.changeDetector.detectChanges();
    }
  }

  findTemplate(state: TemplateNames): TemplateNames {
    return state === 'empty' &&
      this.templates['empty'] == null
      ? 'value'
      : state;
  }

  contextFromState(newState: LoadState<unknown>) {
    if (
      newState.state === 'init' ||
      newState.state === 'idle' ||
      newState.state === 'complete' ||
      newState.state === 'pending'
    ) {
      return {};
    }
    return {
      $implicit: newState.value,
    };
  }

  log(error: unknown) {
    if (this.config.logErrors === true) {
      console.error(error);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
