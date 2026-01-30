# Agent Orchestration

## The Orchestrator

The `orchestrator` is the default agent that analyzes user requests and delegates to specialized agents.

**Set as default in opencode.json:**
```json
{
  "default_agent": "orchestrator"
}
```

## Available Agents

Located in `~/.config/opencode/agents/`:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **orchestrator** | Analyzes and delegates | Default for complex tasks |
| planner | Implementation planning | Complex features, refactoring |
| architect | System design | Architectural decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code review | After writing code |
| security-reviewer | Security analysis | Auth, data handling |
| build-error-resolver | Fix build errors | When build fails |
| e2e-runner | E2E testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| doc-updater | Documentation | Updating docs |
| database-reviewer | Database review | Schema, queries |
| go-reviewer | Go code review | Go projects |
| go-build-resolver | Go build errors | Go compilation |

## Two Interaction Modes

### 1. Orchestrated (Recommended)

Just describe what you want:

```
User: "Add a password reset feature"

Orchestrator automatically:
1. Calls planner → creates plan
2. Waits for confirmation
3. Calls tdd-guide → implements
4. Calls security-reviewer → checks security
5. Calls code-reviewer → final review
```

### 2. Manual Commands

Use slash commands for explicit control:

```
/plan Add a password reset feature
/tdd Implement per the plan
/code-review
```

## Orchestrator Decision Tree

| User Request | Agents Invoked |
|--------------|----------------|
| "Build/Create feature" | planner → architect? → fixer → reviewers |
| "Fix bug" | fixer → code-reviewer |
| "Review my code" | code-reviewer + security-reviewer? |
| "Build is broken" | build-error-resolver |
| "Refactor/clean up" | planner → refactor-cleaner → code-reviewer |
| "Update docs" | doc-updater |
| "Database changes" | database-reviewer → planner? |

## Parallel Task Execution

ALWAYS use parallel execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. code-reviewer → src/api/
2. security-reviewer → src/auth/
3. database-reviewer → migrations/

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## When NOT to Orchestrate

Handle these directly without delegation:
- Simple questions about the codebase
- Quick file reads or searches
- Clarifying questions

**NEVER write code directly.** Even for a one-line change, delegate to `fixer`.

## Agent Invocation Rules

1. **One agent, one focused task** - Don't overload agents
2. **Confirm before major changes** - Present plan, wait for approval
3. **Synthesize results** - Summarize after each agent completes
4. **Ask when uncertain** - Don't guess at user intent
