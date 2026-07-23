---
name: implementation-planning
description: Use when the user explicitly asks for a plan, roadmap, phased implementation, or task breakdown. Produces a plan only; it does not implement code changes.
---

# Implementation Planning

## Workflow

1. Inspect the current codebase and adjacent patterns.
   - architecture
   - related files
   - existing implementation patterns
   - relevant constraints
2. Clarify only what is necessary.
   - Prefer explicit assumptions over long questionnaires.
   - Ask follow-up questions only when the answer would materially change the plan.
3. Draft the plan.
   - overview
   - assumptions
   - phases
   - atomic tasks
   - validation
   - risks
   - rollback
4. Call out uncertainty.
   - Do not hide major ambiguity inside vague tasks.

## Plan Rules

- The output MUST be a plan, not implementation work.
- Tasks SHOULD be atomic, testable, and specific enough to execute without re-planning.
- Relevant file paths SHOULD be included when known.
- Each phase SHOULD have a validation method.
- Risks and rollback SHOULD be explicit for non-trivial work.

## Default Structure

```markdown
# Plan: [Task Name]

## Overview

## Assumptions

## Phase 1: [Name]
### Task 1.1: [Name]

## Phase 2: [Name]

## Validation

## Risks

## Rollback
```
