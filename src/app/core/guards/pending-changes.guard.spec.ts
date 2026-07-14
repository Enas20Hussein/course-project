import {
  pendingChangesGuard,
  PendingChangesGuarded
} from './pending-changes.guard';

describe('pendingChangesGuard', () => {
  const routeSnapshot = {} as any;
  const stateSnapshot = {} as any;

  it('should allow navigation when component can discard changes', () => {
    const component: PendingChangesGuarded = {
      canDiscardChanges: () => true
    };

    expect(
      pendingChangesGuard(
        component,
        routeSnapshot,
        stateSnapshot,
        stateSnapshot
      )
    ).toBeTrue();
  });

  it('should block navigation when component rejects discarding changes', () => {
    const component: PendingChangesGuarded = {
      canDiscardChanges: () => false
    };

    expect(
      pendingChangesGuard(
        component,
        routeSnapshot,
        stateSnapshot,
        stateSnapshot
      )
    ).toBeFalse();
  });
});
