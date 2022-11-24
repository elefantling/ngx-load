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
When more templates are provided, more states will be displayed differently.
```html
<div *ngxLoad="observable$; empty: emptyTemplate; error: errorTemplate;  idle: idleTemplate;  pending: pendingTemplate; complete: completeTemplate; let content" >
  <!-- this will be shown after observable$ emitted a non-empty value -->
  value: {{ content }}
</div>
<ng-template #idleTemplate>
  <!-- this will be shown when observable$ is null (or undefined) -->
  idle
</ng-template>
<ng-template #pendingTemplate>
  <!-- this will be shown when observable$ is set, but no value was emitted -->
  pending
</ng-template>
<ng-template #emptyTemplate>
  <!-- this will be shown after observable$ emitted an empty value -->
  empty
</ng-template>
<ng-template #errorTemplate let-content>
  <!-- this will be shown after observable$ threw an error -->
  error: {{ content }}
</ng-template>
<ng-template #completeTemplate>
  <!-- this will be shown after the observable$ completed -->
  complete
</ng-template>
```

###
