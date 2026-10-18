# Cross-repository task map

## Outcome

After payment confirmation, web and supported mobile clients show a receipt only when the order API can return complete receipt data. Existing mobile versions continue to parse the response. Acceptance requires a staged payment-to-receipt flow with no premature paid state.

## Repository scope

| Repository | Owned behavior/contract | Route evidence | Owner | Status |
|---|---|---|---|---|
| acme/payments | payment.completed producer | observed | unknown | planned |
| acme/order-api | event-to-order-status projection and response | observed | unknown | planned |
| acme/web-store | receipt rendering | observed | unknown | planned |
| acme/mobile | old/new response compatibility | observed | unknown | blocked |

## Shared-contract ledger

| Contract | Producer | Consumers | Compatibility rule | Handoff artifact |
|---|---|---|---|---|
| order-status response | order API | web, mobile | additive fields until mobile window is known | versioned response example |
| payment completion event | payments | order API | preserve existing fields; add readiness signal | event fixture |

## Dependency graph

contract decision → payments ∥ order-api → web ∥ mobile compatibility → staged integration. Consumer work starts only after additive fields and readiness semantics are fixed.

## Work packets

### acme/payments

- Goal: emit an additive readiness signal only when receipt prerequisites are durable.
- Context needed here: current event schema and durability boundary.
- In scope: producer timing and event fixture.
- Out of scope: API response and UI rendering.
- Inputs/dependencies: agreed additive contract.
- Required outputs: producer change and backward-compatible fixture.
- Local validation: retry, duplicate, and delayed persistence cases.
- Completion evidence: test output and emitted fixture.
- Ready when: order API can consume the fixture without removing existing fields.

### acme/order-api

- Goal: expose receipt readiness without breaking existing clients.
- Context needed here: event fixture and current response schema.
- In scope: projection, additive response, compatibility tests.
- Out of scope: client rendering.
- Inputs/dependencies: contract decision.
- Required outputs: versioned response example and tests for old payload parsing.
- Local validation: delayed, duplicate, and out-of-order events.
- Completion evidence: contract-test output.
- Ready when: old response fields keep their meaning and new readiness state is observable.

### acme/web-store

- Goal: wait for receipt readiness before showing the receipt.
- Context needed here: response example.
- In scope: UI state and retry behavior.
- Out of scope: payment and order persistence.
- Inputs/dependencies: staged order API response.
- Required outputs: UI change and browser test.
- Local validation: paid-not-ready, ready, timeout, and refresh.
- Completion evidence: browser-test result.
- Ready when: no premature receipt appears in the staged scenario.

### acme/mobile

- Goal: confirm old-version compatibility and adopt readiness later if required.
- Context needed here: supported-version window and response example.
- In scope: parser compatibility and release decision.
- Out of scope: server semantics.
- Inputs/dependencies: mobile owner and support window.
- Required outputs: compatibility result and rollout note.
- Local validation: oldest supported client against additive response.
- Completion evidence: device or automated compatibility result.
- Ready when: ownership and supported versions are known.

## Cross-repository verification

Run payment confirmation through the staged producer, order projection, and web client. Delay receipt persistence and verify pending behavior; then complete persistence and verify one receipt. Replay the event and verify idempotency. Test the oldest supported mobile client after its version is identified.

## Coordination ledger

| Packet | Issue/PR | State | Evidence | Next handoff |
|---|---|---|---|---|
| contract decision | not supplied | planned | repository roles supplied | publish fixtures |
| mobile compatibility | not supplied | blocked | owner/version missing | identify owner and support window |

## Unresolved routing questions

- Who owns acme/mobile, and what is the oldest supported version? Until answered, use additive response fields and do not make mobile adoption a release prerequisite.
