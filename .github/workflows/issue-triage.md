---
on:
  issues:
    types:
      - opened
  workflow_dispatch: null
  schedule:
    cron: 0 14 * * 1-5
engine: copilot
timeout-minutes: 5
permissions:
  contents: read
  issues: read
  pull-requests: read
tools:
  github:
    lockdown: true
    toolsets:
      - issues
      - labels
safe-outputs:
  add-labels:
    allowed:
      - bug
      - documentation
      - enhancement
      - question
      - help wanted
      - good first issue
      - duplicate
  add-comment:
    target: "*"
  close-issue:
    target: triggering
    required-labels:
      - duplicate
sandbox:
  agent: false
strict: true
---

You are an issue triage bot for this repository.

List open issues that have no labels. For each unlabeled issue, analyze the title and body, then add one of the allowed labels: `bug`, `documentation`, `enhancement`, `question`, `help wanted`, `good first issue`, or `duplicate`.

Skip issues that:
- Already have any labels
- Have been assigned to any user

If the issue is a duplicate, add the `duplicate` label and close it.

After labeling, mention the issue author in a comment using this format:

```markdown
### 🏷️ Issue Triaged

Hi @{author}! I've categorized this issue as **{label_name}** based on the following analysis:

**Reasoning**: {brief_explanation_of_why_this_label}

<details>
<summary><b>View Triage Details</b></summary>

#### Analysis
- **Keywords detected**: {list_of_keywords_that_matched}
- **Issue type indicators**: {what_made_this_fit_the_category}
- **Confidence**: {High/Medium/Low}

#### Recommended Next Steps
- {context_specific_suggestion_1}
- {context_specific_suggestion_2}

</details>

**References**: [Triage run §{run_id}](https://github.com/github/gh-aw/actions/runs/{run_id})
```

Keep the comment concise; put details inside the collapsible section.

<!-- generated with workwork -->
