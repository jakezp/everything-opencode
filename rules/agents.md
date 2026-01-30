# Agent Orchestration

## The Orchestrator

The `EO-orchestrator` is the default agent that analyzes user requests and delegates to specialized agents.

**Set as default in opencode.json:**
```json
{
  "default_agent": "EO-orchestrator"
}
```

## Available Agents

Located in `~/.config/opencode/agents/`:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **EO-orchestrator** | Analyzes and delegates | Default for complex tasks |
| EO-planner | Implementation planning | Complex features, refactoring |
| EO-architect | System design | Architectural decisions |
| EO-tdd-guide | Test-driven development | New features, bug fixes |
| EO-code-reviewer | Code review | After writing code |
| EO-security-reviewer | Security analysis | Auth, data handling |
| EO-build-error-resolver | Fix build errors | When build fails |
| EO-e2e-runner | E2E testing | Critical user flows |
| EO-refactor-cleaner | Dead code cleanup | Code maintenance |
| EO-doc-updater | Documentation | Updating docs |
| EO-database-reviewer | Database review | Schema, queries |
| EO-go-reviewer | Go code review | Go projects |
| EO-go-build-resolver | Go build errors | Go compilation |

## Two Interaction Modes

### 1. Orchestrated (Recommended)

Just describe what you want:

```
User: "Add a password reset feature"

EO-orchestrator automatically:
1. Calls EO-planner → creates plan
2. Waits for confirmation
3. Calls EO-tdd-guide → implements
4. Calls EO-security-reviewer → checks security
5. Calls EO-code-reviewer → final review
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
| "Build/Create feature" | EO-planner → EO-architect? → EO-fixer → reviewers |
| "Fix bug" | EO-fixer → EO-code-reviewer |
| "Review my code" | EO-code-reviewer + EO-security-reviewer? |
| "Build is broken" | EO-build-error-resolver |
| "Refactor/clean up" | EO-planner → EO-refactor-cleaner → EO-code-reviewer |
| "Update docs" | EO-doc-updater |
| "Database changes" | EO-database-reviewer → EO-planner? |

## Parallel Task Execution

ALWAYS use parallel execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. EO-code-reviewer → src/api/
2. EO-security-reviewer → src/auth/
3. EO-database-reviewer → migrations/

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## When NOT to Orchestrate

Handle these directly without delegation:
- Simple questions about the codebase
- Quick file reads or searches
- Clarifying questions

**NEVER write code directly.** Even for a one-line change, delegate to `EO-fixer`.

## Agent Invocation Rules

1. **One agent, one focused task** - Don't overload agents
2. **Confirm before major changes** - Present plan, wait for approval
3. **Synthesize results** - Summarize after each agent completes
4. **Ask when uncertain** - Don't guess at user intent
