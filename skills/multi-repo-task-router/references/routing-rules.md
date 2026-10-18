# Routing rules

## Assign responsibility once

Route work to the repository that owns the changed behavior or contract:

| Work | Primary route |
|---|---|
| API or event schema | contract producer or shared-schema repository |
| Client adaptation | each consuming repository |
| End-to-end compatibility | integration or deployment owner |
| Shared library change | library repository, followed by consumer upgrades |
| User-facing documentation | documentation owner after behavior stabilizes |
| Rollout and rollback | repository or platform that controls the release |

Coordination tasks may reference several repositories but must not hide the concrete change owner.

## Scope evidence

Grade each route:

- **observed**: the supplied repository map, file path, manifest, code excerpt, or owner record supports it.
- **inferred**: architecture or naming strongly suggests it, but direct ownership evidence is absent.
- **unknown**: no defensible route is available.

Unknown ownership blocks issue creation only for the affected packet; it does not erase well-supported packets.

## Dependency ordering

1. Define or confirm the shared contract.
2. Make producer changes backward-compatible when possible.
3. Update consumers against the published or staged contract.
4. Run repository-local validation.
5. Run cross-repository integration checks.
6. Roll out in the stated order and verify observable behavior.

If a breaking change is unavoidable, require an explicit migration window, version handshake, and rollback route.
