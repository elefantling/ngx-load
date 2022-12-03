# ngx-load
`*ngxLoad` is a structural directive that works a bit like combining `*ngIf` with the `async`-Pipe and providing some advanced features along the way.

## States
A variable holding an observable can be in serveral states:
- **idle**: `observable$` is not set
- **pending**: `observable$` is set, but has not emitted a value yet
- **empty**: `observable$` is set, has emitted a value, but the value was empty (something like `0`, `''`, `[]` or `{}`)
- **value**: `observable$` is set, and has emitted a value
- **error**: `observable$` is set, and has thrown an error
- **complete**: `observable$` is set, and has completed

## Installation

```
npm install @elefantling/ngx-load
```

```typescript
import { NgxLoadModule } from '@elefantling/ngx-load';

@NgModule({
  imports: [
    NgxLoadModule
  ],
})
export class AppModule { }
```



## Usage

### Minimal example
```html
<div *ngxLoad="observable$; let content">
  <!-- this will be shown after observable$ emitted a any value -->
  value: {{ content }}
</div>
```
This will display nothing until the observable emitted a value. For comparision using `*ngIf`:
```html
<div *ngIf="observable$ | async as content">
  value: {{ content }}
</div>
```
Note that `*ngIf` will not show the value if `content` is actually `false` (or `0` or whatever is deemed false in Javascript 🤣).

### Complete example
When more templates are provided, more states can be displayed individually.
```html
<div *ngxLoad="observable$; empty: emptyTemplate; error: errorTemplate;  idle: idleTemplate;  pending: pendingTemplate; complete: completeTemplate; let content" >
  <!-- this will be shown after observable$ emitted a non-empty value -->
  value: {{ content }}
</div>
<ng-template #idleTemplate>
  <!-- this will be shown when observable$ is null (or undefined). Nothing will be shown if this isn't present. -->
  idle
</ng-template>
<ng-template #pendingTemplate>
  <!-- this will be shown when observable$ is set, but no value was emitted. Nothing will be shown if this isn't present. -->
  pending
</ng-template>
<ng-template #emptyTemplate>
  <!-- this will be shown after observable$ emitted an empty value. The value template will be shown with the empty value, if this isn't present -->
  empty
</ng-template>
<ng-template #errorTemplate let-content>
  <!-- this will be shown after observable$ threw an error, nothing will be shown if an error occured and this template is not present -->
  error: {{ content }}
</ng-template>
<ng-template #completeTemplate>
  <!-- this will be shown after the observable$ completed. If this template is not present, the display will not change. -->
  complete
</ng-template>
```

###
