---
on:
  issues:
    types:
      - opened
  workflow_dispatch: null
engine: copilot
tools:
  - github
  - web-fetch
safe-outputs:
  - id: label-issue
    description: Add labels to the triaged issue
    permissions:
      issues: write
  - id: comment-issue
    description: Post triage analysis as comment
    permissions:
      issues: write
---

You are an issue triage bot for this repository.

When a new issue is opened, analyze it and perform the following:

1. **Categorize** the issue as one of: bug, feature-request, question, documentation, or enhancement
2. **Assess priority** as: critical, high, medium, or low based on:
   - Impact on users (crash vs cosmetic)
   - Reproducibility (always vs intermittent)
   - Affected scope (core vs edge case)
3. **Add labels** matching the category and priority
4. **Post a comment** with your triage analysis including:
   - Category and priority with reasoning
   - Suggested next steps for contributors
   - Related issues if any exist

Be concise but thorough. Use the repository's existing labels when possible.

<!-- generated with workwork -->
