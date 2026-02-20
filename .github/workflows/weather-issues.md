---
on:
  issues:
    types:
      - opened
engine: copilot
tools:
  github: null
safe-outputs:
  add-comment: null
  add-labels:
    blocked:
      - ~*
      - "*[bot]"
  remove-labels:
    blocked:
      - ~*
      - "*[bot]"
  close-issue: null
  close-pull-request: null
  create-issue: null
  update-issue: null
  create-pull-request: null
  update-pull-request: null
  create-discussion: null
  create-pull-request-review-comment: null
  submit-pull-request-review: null
  add-reviewer: null
  assign-to-user: null
  assign-milestone: null
  push-to-pull-request-branch: null
---

In every issue, make sure you fetche the latest weather in San Francisco, and reply with a comment about it.

<!-- generated with workwork -->
