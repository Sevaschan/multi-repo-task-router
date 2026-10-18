# iPolloWork acceptance output

Observed on 2026-10-18 in iPolloWork 0.50.20 with the OpenCode engine.

The installed Skill produced an execution-ready task map for the supplied checkout race across `acme/payments`, `acme/order-api`, `acme/web-store`, and `acme/mobile`. The response contained every required section:

- Outcome and measurable acceptance criteria
- Repository scope with routing evidence and owner status
- Shared-contract ledger for `payment.completed`, the order-status API, receipt-readiness semantics, and rollout order
- Dependency graph covering the service, web, and delayed mobile release paths
- Per-repository work packets with goals, local context, scope boundaries, dependencies, outputs, validation, completion evidence, and readiness conditions
- Cross-repository verification for delayed receipts, duplicate or out-of-order events, web retry behavior, old and new mobile clients, staged rollout, and rollback
- Coordination ledger with evidence and next handoffs
- Unresolved routing questions with explicitly labeled temporary assumptions

The output did not invent the missing mobile owner or supported-version window. It marked both as unresolved inputs and required measured compatibility evidence before a mobile task could be considered ready.

Representative routing result:

```text
Confirm receipt-readiness semantics and shared contracts
  -> payments compatibility deployment
  -> order-api compatible state/API behavior
  -> web-store adaptation
  -> cross-repository verification
  -> staged payments -> order-api -> web rollout

Mobile proceeds after the order-api contract is frozen and the actual
owner/version window is supplied; old-client compatibility remains a gate.
```
