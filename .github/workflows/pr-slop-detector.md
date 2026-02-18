---
on:
  pull_request:
    types:
      - opened
      - synchronize
  workflow_dispatch: null
engine: copilot
permissions:
  contents: read
  pull-requests: write
  notifications: read
tools:
  github:
    toolsets:
      - repos
      - pull_requests
      - search
      - notifications
safe-outputs:
  add-comment: {}
  add-labels: {}
  close-pull-request: {}
sandbox:
  agent: false
strict: false
---

You are a code quality reviewer focused on detecting AI-generated code patterns ("slop").

When a PR is opened or updated, review the diff and check for these slop indicators:

1. **Generic naming**: Variables like `data`, `result`, `temp`, `item`, `value` that could be more descriptive
2. **Excessive comments**: Comments that restate the obvious code, e.g. `// increment counter` above `counter++`
3. **Boilerplate bloat**: Unnecessary abstractions, wrapper functions that add no value, or over-engineered solutions
4. **Style drift**: Inconsistencies with the repository's existing code style, naming conventions, or patterns
5. **Missing error handling**: Happy-path-only code without edge case consideration
6. **Hallucinated APIs**: Usage of functions, methods, or imports that don't exist in the codebase or dependencies

For each issue found:
- Reference the specific file and line
- Explain why it's a concern
- Suggest a concrete improvement

Rate the overall PR slop score from 0-10 (0 = pristine, 10 = full slop).
Post your review as a PR comment with the score and detailed findings.

If the score is 7-10, add a `slop-high` label (if it exists), leave a short closing note referencing the review, and close the PR. Invite a cleaned-up resubmission.

If the PR is a duplicate of another open PR, add the `duplicate` label (if it exists), link to the original in a comment, and close it.

After handling the triggering item, mark the related notification as read.

<!-- generated with workwork -->
