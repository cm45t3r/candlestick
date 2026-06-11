# Implementation Plan

## Task Format Template

Use whichever pattern fits the work breakdown:

### Major task only

- [ ] {{NUMBER}}. {{TASK_DESCRIPTION}}{{PARALLEL_MARK}}
  - {{DETAIL_ITEM_1}} _(Include details only when needed. If the task stands alone, omit bullet items.)_
  - _Requirements: {{REQUIREMENT_IDS}}_

### Major + Sub-task structure

- [ ] {{MAJOR_NUMBER}}. {{MAJOR_TASK_SUMMARY}}
- [ ] {{MAJOR_NUMBER}}.{{SUB_NUMBER}} {{SUB_TASK_DESCRIPTION}}{{SUB_PARALLEL_MARK}}
  - {{DETAIL_ITEM_1}}
  - {{DETAIL_ITEM_2}}
  - {{OBSERVABLE_COMPLETION_ITEM}} _(At least one detail item should state the observable completion condition for this task.)_
  - _Requirements: {{REQUIREMENT_IDS}}_ _(IDs only; do not add descriptions or parentheses.)_
  - _Boundary: {{COMPONENT_NAMES}}_ _(Only for (P) tasks. Omit when scope is obvious.)_
  - _Depends: {{TASK_IDS}}_ _(Only for non-obvious cross-boundary dependencies. Most tasks omit this.)_

> **Parallel marker**: Append ` (P)` only to tasks that can be executed in parallel. Omit the marker when running in `--sequential` mode.
>
> **Optional test coverage**: When a sub-task is deferrable test work tied to acceptance criteria, mark the checkbox as `- [ ]*` and explain the referenced requirements in the detail bullets.
