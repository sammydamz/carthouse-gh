# Developer Workflow: Our Skills + Superpowers

This document outlines the combined workflow integrating our existing skills with Superpowers.

## Synergy Overview

| Phase | Our Skill | Superpowers Skill | Description |
|-------|-----------|-------------------|-------------|
| **Triage** | `triage` | — | Categorize issues, assign state |
| **Planning** | `to-issues`, `grill-me`, `grill-with-docs` | ~~`brainstorming`~~ | Break specs, stress-test design first |
| **Branch** | (in AGENTS.md) | ~~`using-git-worktrees`~~ | Our workflow rule is simpler |
| **Branch** | (in AGENTS.md) | `using-git-worktrees` | Create isolated development branch |
| **Plan** | agent brief | `writing-plans` | Detailed task breakdown |
| **Execute** | execute directly | `subagent-driven-development` | Implement via agents |
| **Test** | — | `test-driven-development` | Red/green/refactor |
| **Review** | — | `requesting-code-review` | Pre-merge checklist |
| **Finish** | — | `finishing-a-development-branch` | PR/merge decision |

## Workflow Steps

### Priority Order
> **Use `grill-me` or `grill-with-docs` BEFORE `brainstorming`**

We prefer our existing grilling skills over Superpowers' brainstorming:
1. `/grill-me` — stress-test plans and designs with questions
2. `/grill-with-docs` — validate against domain model
3. Then `/brainstorming` if more exploration needed

### 1. Triage Issues
```
/triage
```
- Categorize: bug / enhancement
- States: needs-triage → needs-info / ready-for-agent / ready-for-human / wontfix

### 2. Break into Issues
```
/to-issues
```
- Convert PRD/spec into independently-grabbable issues
- Each issue = one slice

### 3. Brainstorming (Superpowers)
- Refine rough ideas through questions
- Explore alternatives
- Present design in sections for validation

### 4. Create Branch
```
Each issue → own branch
Branch name: <issue-number>-<slug>
Example: 2-foundation, 4-car-detail-page
```
- PR per issue → independent review
- Keeps history clean

### 5. Write Agent Brief
Post to GitHub issue:
- Category + summary
- Current behavior
- Desired behavior
- Key interfaces
- Acceptance criteria
- Out of scope

### 6. Implementation
**Option A: Direct execute**
- I work on the issue directly

**Option B: Superpowers subagent**
```
/subagent-driven-development
```
- Dispatches subagent per task
- Two-stage review (spec compliance → code quality)

**Option C: Execute plans**
```
/executing-plans
```
- Batch execution with checkpoints

### 7. Test-Driven Development
```
/test-driven-development
```
- RED: write failing test
- GREEN: minimal code to pass
- REFACTOR: improve without breaking

### 8. Code Review
```
/requesting-code-review
```
- Check against plan
- Report issues by severity
- Critical = block progress

### 9. Finish Branch
```
/finishing-a-development-branch
```
- Verify tests pass
- Options: merge / PR / keep / discard

## Installation

### Our Skills (already set up)
- `triage` — issue triage
- `to-issues` — break specs into issues
- Domain-specific skills

### Superpowers
```bash
/plugin install superpowers@claude-plugins-official
```

Or for OpenCode:
```bash
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

## Key Superpowers Skills

### brainstorming
- Activates BEFORE writing code
- Refines rough ideas through questions
- Presents design in chunks
- Saves design document

### using-git-worktrees
- Creates isolated workspace on new branch
- Runs project setup
- Verifies clean test baseline

### writing-plans
- Breaks work into 2-5 minute tasks
- Each task has:
  - Exact file paths
  - Complete code
  - Verification steps

### subagent-driven-development
- Dispatches fresh subagent per task
- Two-stage review:
  1. Spec compliance
  2. Code quality

### test-driven-development
- RED-GREEN-REFACTOR cycle
- Write failing test first
- Minimal code to pass
- Refactor

### requesting-code-review
- Reviews against plan
- Reports by severity
- Critical blocks progress

### finishing-a-development-branch
- Verifies tests
- Present options:
  - Merge now
  - Open PR
  - Keep working
  - Discard

## Notes

- Skills trigger automatically when relevant
- Mandatory workflows, not suggestions
- Test-driven development is core to Superpowers
- Use worktrees for parallel issue work