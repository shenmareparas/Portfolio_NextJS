---
name: react-doctor
description: Use when finishing a feature, fixing a bug, before committing React code, or when the user types `/doctor`, asks to scan, triage, or clean up React diagnostics. Covers lint, accessibility, bundle size, architecture. Includes a regression check and a full local-triage workflow that fetches the canonical playbook.
version: "1.2.0"
---

# React Doctor

Scans React codebases for security, performance, correctness, and architecture issues. Outputs a 0–100 health score.

## After making React code changes:

Run `bunx react-doctor@latest --verbose --scope changed` and check the score did not regress.

If the score dropped, fix the regressions before committing.

## For general cleanup or code improvement:

Run `bunx react-doctor@latest --verbose` (the default `--scope full`) to scan the full codebase. Fix issues by severity — errors first, then warnings.

## For a focused UI design audit:

Run `bunx react-doctor@latest design --verbose`. This selects only design-tagged UI composition, typography, interaction, accessibility, and motion rules, including focused rules that remain opt-in during a general health scan.

## For runtime performance problems:

Run `bunx react-doctor@latest scan <url> --format json` in an interactive terminal (or `--format text` / `--format jsonl`, plus `--trace-out <path>` to pick where the compressed trace is written). React Doctor opens an isolated system Chrome profile, records a DevTools trace while the user reproduces the slow interaction, and flashes purple outlines with component names as React renders. It stops when they press Enter. Read the structured summary first, then inspect the returned local `.json.gz` trace for CPU, browser, and React component evidence.

If the user needs their authenticated browser state, use `--cdp <remote-debugging-url>`. This requires Chrome to already be running with remote debugging. Never ask for cookies or copy the user's browser profile. Treat the trace as sensitive local application data and never upload it without explicit permission.

## Local Portfolio Workflow (Bun)

This repository declares `"doctor": "react-doctor"` in `package.json` (`react-doctor` `^0.9.22`) and enforces staged checks via `.git/hooks/pre-commit` (`--staged --blocking warning`). In Bun-only environments where `node` is not installed globally, invoke the local CLI via:

```bash
bun run doctor -- --yes --verbose
bun --bun node_modules/.bin/react-doctor --scope changed --verbose
```

## /doctor — full local triage workflow

When the user types `/doctor`, says "run react doctor", or asks for a full triage / cleanup pass (not just a regression check), fetch the canonical local-triage playbook and follow every step in it:

```bash
curl --fail --silent --show-error \
  --header 'Cache-Control: no-cache' \
  https://www.react.doctor/prompts/react-doctor-agent.md
```

The playbook is the single source of truth — a scan -> filter -> triage -> fix -> validate loop that edits the working tree directly (never commits, never opens PRs). Updating the prompt at its source updates every agent on its next fetch — no skill reinstall needed.

Pair it with the matching per-rule prompts at `https://www.react.doctor/prompts/rules/<plugin>/<rule>.md` (fetched on demand inside the playbook) so each fix uses the canonical, reviewer-tested recipe.

Use `--scope contextual --base origin/main` when a team wants existing findings
in the code it is editing. Rules can select an element, function, file, or an
explicit set of related nodes. For `exhaustive-deps`, edits in the hook call or a
resolved local callback can surface a finding on an unchanged dependency array.
Rules without wider ownership keep changed-line filtering.

## Explaining diagnostics at a specific location

To understand why a rule fired or why an inline suppression did not apply at a specific `file:line`:

```bash
bunx react-doctor@latest why <file:line>
```

## Configuring or explaining rules

When the user wants to understand a rule, disagrees with one, or wants to disable / tune which rules run (not fix code), read [references/explain.md](references/explain.md) and follow it. Start with `bunx react-doctor@latest rules explain <rule>`, then apply the narrowest control via `bunx react-doctor@latest rules disable|enable|set|category|ignore-tag …`, which edits your `doctor.config.*` (or `package.json#reactDoctor`).

## Command

```bash
bunx react-doctor@latest [paths...] --verbose --scope changed
```

| Flag                            | Purpose                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `.` or `[paths...]`             | Scan the current directory, a workspace app directory, or explicit source file paths             |
| `--verbose`                     | Show every rule and per-file details (default shows top 3 rules)                                 |
| `--scope <value>`               | Scope to scan/report: `full` (default), `files`, `changed`, `lines`, or `contextual`             |
| `--base <ref>`                  | Base git ref for `files`/`changed`/`lines`/`contextual` scope (auto-detected when omitted)       |
| `--baseline <report.json>`      | Report only new findings compared with a saved JSON report                                       |
| `--include-untracked`           | With `--scope files/changed/lines/contextual`, also scan untracked files (respects `.gitignore`) |
| `--staged`                      | Scan only staged (git index) files for pre-commit hooks (exits `0` when nothing is staged)       |
| `--project <name>`              | Select workspace projects by name or path (comma-separated); overrides config `projects`         |
| `--category <category>`         | Filter diagnostics to one category (repeatable; e.g., `Security`)                                |
| `--json` / `--json-compact`     | Output a single structured JSON report (compact removes indentation)                             |
| `--json-out <path>`             | With `--json`, write the report to a file instead of stdout                                      |
| `--score`                       | Output only the numeric health score                                                             |
| `--no-score` / `--no-telemetry` | Skip the score API, share URL, and crash reporting                                               |
| `--blocking <level>`            | Severity that fails CI: `error` (default), `warning`, or `none` (advisory)                       |
| `--warning-exit-code <code>`    | Exit code for non-blocking warnings (`2`–`255`); ignored with `--blocking none` or `--score`     |
| `--warnings` / `--no-warnings`  | Show (default) or hide warning-severity diagnostics                                              |
| `--no-respect-inline-disables`  | Audit mode: neutralize inline lint suppressions before scanning                                  |
| `--no-lint`                     | Skip linting                                                                                     |
| `--no-supply-chain`             | Skip Socket.dev dependency supply-chain checks                                                   |
| `--no-cache`                    | Disable all scan caches for this run                                                             |
| `--no-parallel`                 | Run serially in one worker (`REACT_DOCTOR_PARALLEL` sets worker count)                           |
| `--max-duration <seconds>`      | Total run time budget shared across workspace projects; emits partial results when exceeded      |
| `--output-dir <dir>`            | Write full diagnostics dump to a custom directory instead of a temp folder                       |
| `-y, --yes`                     | Skip interactive prompts and scan all workspace projects                                         |
| `--debug`                       | Force a Sentry trace and print its trace ID on exit                                              |

_Deprecated aliases:_ prefer `--scope changed` over `--diff [base]` (`--diff false` -> `--scope full`), and `--blocking <level>` over `--fail-on <level>`.

### Subcommands

| Subcommand                | Purpose                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `design [directory]`      | Run only the focused UI design diagnostics (skips maintainability, supply-chain, and score passes) |
| `scan [url]`              | Profile a live React interaction in Chrome (`--format text\|json\|jsonl`, `--cdp`, `--trace-out`)  |
| `why <file:line>`         | Explain why a rule fired (or why a suppression did not apply) at a specific location               |
| `rules <cmd>`             | `list`, `explain`, `set`, `enable`, `disable`, `category`, `ignore-tag`, `unignore-tag`            |
| `ci <cmd>`                | `install`, `config`, `upgrade` for GitHub Actions and GitLab CI workflows                          |
| `install` (alias `setup`) | Install agent skills and optional git hooks (`-y`, `--dry-run`, `--agent-hooks`)                   |
| `version`                 | Print React Doctor version, Node/runtime version, and platform info                                |

### Reuse a base scan

Save a complete `--json` scan, then pass `--baseline base-report.json` to report only new findings. This also works with `--scope changed`. Use the same version and rules for both scans. Findings are grouped by rule and file path, following Git renames. Only increases in each group's count are reported; groups without an increase skip location matching. Fingerprints, message similarity, and Git-adjusted line distance select the added findings. Formatting and edits that keep the same counts report no new findings. Saved reports must use the same `textComponents`, `rawTextWrapperComponents`, and `respectInlineDisables` settings. Regenerate the base report after changing these settings, or use a Git comparison. Older reports without fingerprints or `sourceFilterConfigHash` must be regenerated.

### GitLab warning status

For GitLab CI, `--warning-exit-code 123` returns `123` for non-blocking warnings. Pair it with `allow_failure: { exit_codes: 123 }`. Errors still return `1`. Accepts integers from `2` to `255`. `--blocking warning` still returns `1`. `--blocking none` or `--score` skips this warning signal.
