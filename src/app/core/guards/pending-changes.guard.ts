import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface PendingChangesGuarded {
  canDiscardChanges: () =>
    | boolean
    | Promise<boolean>
    | Observable<boolean>;
}

export const pendingChangesGuard:
  CanDeactivateFn<PendingChangesGuarded> = (
    component
  ) => component.canDiscardChanges();
