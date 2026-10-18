# Multi-Repo Task Router

[简体中文](README.zh-CN.md)

Multi-Repo Task Router is an agent Skill that turns a development request spanning several repositories into an ownership-aware execution map. It preserves the shared outcome while producing repository scope evidence, contract handoffs, dependency order, self-contained work packets, and cross-repository verification.

The Skill supports [iPolloWork](https://github.com/Devin-AXIS/iPolloWork) through a ready-to-import .ipollowork-plugin package. It is declarative, needs no account or external service, and can prepare work before a team creates issues or pull requests in GitHub, Slack, or Microsoft Teams.

## Who it is for

- Platform teams coordinating producer and consumer changes across services.
- Maintainers turning a Slack or Teams conversation into repository-specific tasks.
- Engineering leads planning compatible API, event, package, or schema changes.
- Incident responders who need parallel work without losing contract dependencies.

## What it does

- Separates observed repository ownership from inference and unknown routes.
- Maps APIs, events, schemas, packages, flags, versions, and runbooks across producers and consumers.
- Orders tasks with explicit serial gates and safe parallel lanes.
- Builds one focused packet per repository with context, boundaries, outputs, validation, and completion evidence.
- Adds a coordination ledger for planned, blocked, in-progress, and verified work.
- Keeps issue or pull-request creation separate from proof that the integrated behavior works.

## Workflow

1. Provide the request or conversation, candidate repositories, known owners, shared interfaces, and deployment constraints.
2. Ask the agent to use **Multi-Repo Task Router**.
3. Review the proposed repository scope and any provisional routes.
4. Confirm shared contracts and the dependency graph.
5. Use the per-repository packets as issue, PR, or agent prompts.
6. Update the coordination ledger with real links and observed validation results.

## Inputs and outputs

Minimum input is a cross-repository request plus candidate repository names. Better routing includes an architecture map, ownership records, interface examples, supported client versions, rollout order, and issue conventions.

The output is Markdown containing the outcome, repository scope table, shared-contract ledger, dependency graph, per-repository work packets, integration verification, coordination ledger, and unresolved routing questions.

## End-to-end example

Use [examples/conversation-request.md](examples/conversation-request.md) and ask:

> Use Multi-Repo Task Router to split this payment-to-receipt race across the listed repositories. Preserve old mobile compatibility and show the dependency order.

The expected result in [examples/expected-task-map.md](examples/expected-task-map.md) routes the event producer, order projection, web rendering, and mobile compatibility separately; requires additive contracts while the mobile support window is unknown; and gates staged integration on shared fixtures and contract tests.

## Install and use in iPolloWork

The package was tested with iPolloWork 0.50.20 on macOS 15.5 arm64 using the OpenCode engine.

1. Download multi-repo-task-router-1.0.0.ipollowork-plugin from the GitHub Release.
2. Open iPolloWork and choose **Extensions → Plugins → Add → File**.
3. Select the package, confirm the preview shows one Skill, and choose **Install plugin**.
4. Open the plugin details and confirm **Multi-Repo Task Router** is enabled. Reload when prompted.
5. In a project task, paste the conversation and repository list, then explicitly ask the agent to use Multi-Repo Task Router.
6. Review the scope table before creating external issues or PRs, then export or save the Markdown.

For the local-Skill route, download multi-repo-task-router-1.0.0-skill.zip, extract it, and select the folder that directly contains SKILL.md in iPolloWork's **Import local Skill** flow.

If the Skill is not discovered, verify that the plugin is enabled, reload the project, and confirm that you imported the installation package rather than the source archive. If routes remain unknown, supply ownership or architecture evidence instead of guessing.

## Build and verify

Requires Node.js 20 or later and the standard zip utility on macOS or Linux.

    npm test
    npm run package
    cd dist && shasum -a 256 -c SHA256SUMS.txt

The build produces the iPolloWork installation package, standalone Skill ZIP, source ZIP, and SHA-256 checksums.

## Environment and limits

- Tested: iPolloWork 0.50.20, macOS 15.5 arm64, OpenCode.
- No external runtime, network permission, token, Slack account, Teams account, or GitHub account is required by the Skill itself.
- The Skill prepares routing artifacts from supplied evidence. It does not inspect private repositories, create external issues, or validate deployed behavior unless corresponding tools and authorization are available.
- Repository ownership and supported-version windows remain provisional until the user supplies or verifies them.

## License

MIT
