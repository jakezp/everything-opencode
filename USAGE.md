# Usage Guide: everything-opencode

A comprehensive guide to getting the most out of everything-opencode, based on 10+ months of battle-tested patterns from the original everything-claude-code project.

---

## Table of Contents

1. [Interaction Model](#interaction-model) ⬅️ **Start Here**
2. [Quick Start](#quick-start)
3. [Commands (Manual Control)](#commands-manual-control)
4. [Agents](#agents)
5. [Skills](#skills)
6. [Hooks](#hooks)
7. [Rules](#rules)
8. [MCPs](#mcps-model-context-protocol)
9. [Context Management](#context-management)
10. [Token Optimization](#token-optimization)
11. [Parallelization](#parallelization)
12. [Tips and Tricks](#tips-and-tricks)

---

## Interaction Model

everything-opencode provides **two ways** to work with agents:

### Option 1: Orchestrated (Recommended for Complex Tasks)

Just describe what you want. The **orchestrator** agent analyzes your request and delegates to specialized agents automatically.

```
You: "Add a password reset feature with email verification"

Orchestrator (automatically):
├── 1. Calls planner → Creates implementation plan
├── 2. Presents plan, waits for your confirmation
├── 3. Calls architect → Designs the email/token flow
├── 4. Calls tdd-guide → Implements with tests
├── 5. Calls security-reviewer → Checks for vulnerabilities
└── 6. Calls code-reviewer → Final quality review

You: ← Receive completed feature with reviews
```

**When to use:** New features, complex changes, multi-step tasks, when you want end-to-end automation.

### Option 2: Manual Commands (For Explicit Control)

Use slash commands to invoke specific agents directly.

```
You: /plan Add a password reset feature
     ↓
planner agent → Returns implementation plan

You: (review and modify plan)

You: /tdd Implement password reset per the plan
     ↓
tdd-guide agent → Implements with tests

You: /code-review
     ↓
code-reviewer agent → Reviews the implementation
```

**When to use:** When you want fine-grained control, specific agents, or to skip steps.

### How It Works Together

```
┌─────────────────────────────────────────────────────────────┐
│                         YOU                                 │
│                          │                                  │
│         ┌────────────────┴────────────────┐                 │
│         ▼                                 ▼                 │
│   "Build X feature"              "/plan Build X"            │
│   (natural language)              (explicit command)        │
│         │                                 │                 │
│         ▼                                 ▼                 │
│   ┌──────────────┐                 ┌─────────────┐          │
│   │ ORCHESTRATOR │                 │   planner   │          │
│   │  (analyzes,  │                 │   (direct)  │          │
│   │  delegates)  │                 └─────────────┘          │
│   └──────┬───────┘                                          │
│          │                                                  │
│    ┌─────┴─────┬─────────┬─────────┬──────────┐             │
│    ▼           ▼         ▼         ▼          ▼             │
│ planner → architect → tdd-guide → security → reviewer       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quick Reference: Which to Use?

| Scenario | Approach |
|----------|----------|
| "Build a new feature" | Orchestrated (just describe it) |
| "I want to plan first, then decide" | `/plan` command |
| "Review my code before commit" | Either works |
| "Fix this specific bug" | Orchestrated or `/tdd` |
| "Just run security review" | `/security-review` command |
| "Complex multi-step project" | Orchestrated |
| "Quick small change" | Do it directly (no agent needed) |

---

## Quick Start

```bash
# Install the plugin
npm install -g everything-opencode

# Copy agents, commands, skills, rules to your config
everything-opencode install

# Add to your opencode.json
{
  "plugin": ["everything-opencode"],
  "default_agent": "orchestrator"
}

# Start using
opencode
```

**Setting the default agent to `orchestrator`** enables automatic delegation. Without this, you'd use manual commands.

---

## Commands (Manual Control)

Commands give you explicit control over which agent to invoke.

### Available Commands

| Command | Agent Invoked | Purpose |
|---------|---------------|---------|
| `/plan` | planner | Create implementation plan |
| `/tdd` | tdd-guide | Test-driven development |
| `/code-review` | code-reviewer | Quality review |
| `/build-fix` | build-error-resolver | Fix build errors |
| `/refactor-clean` | refactor-cleaner | Dead code removal |
| `/e2e` | e2e-runner | E2E test generation |
| `/go-review` | go-reviewer | Go-specific review |
| `/go-build` | go-build-resolver | Fix Go build errors |
| `/go-test` | tdd-guide (Go mode) | Go TDD workflow |
| `/verify` | (verification loop) | Run verification checks |
| `/checkpoint` | (saves state) | Save verification state |
| `/learn` | (pattern extraction) | Extract patterns mid-session |

### Command Workflow Example

```
# Step-by-step manual workflow:

/plan Add user authentication with OAuth
# → planner creates detailed plan
# → You review and approve

/tdd Implement OAuth flow per the plan  
# → tdd-guide writes tests first, then implements

/code-review
# → code-reviewer examines the implementation

/security-review Check the OAuth implementation
# → security-reviewer looks for vulnerabilities
```

### When Commands Are Better Than Orchestration

1. **Skip steps** - Don't need a plan? Jump straight to `/tdd`
2. **Specific expertise** - Want only security review? Use the command
3. **Learning** - See exactly what each agent does
4. **Debugging** - Isolate which agent is causing issues
5. **Quick tasks** - Small focused work doesn't need orchestration

---

## Agents

### The Orchestrator

The `orchestrator` is the meta-agent that coordinates all other agents.

**What it does:**
- Analyzes your request
- Determines which agents to invoke
- Sequences them appropriately
- Synthesizes results
- Confirms before major actions

**It delegates to these specialized agents:**

### Specialized Agents

| Agent | Expertise | Invoked When... |
|-------|-----------|-----------------| 
| **planner** | Implementation planning | Complex features, refactoring needs |
| **architect** | System design | New systems, schema design, major changes |
| **tdd-guide** | Test-driven development | Any code implementation |
| **code-reviewer** | Quality review | After code is written |
| **security-reviewer** | Security analysis | Auth, data handling, APIs |
| **build-error-resolver** | Build fixes | Compilation/type errors |
| **e2e-runner** | E2E tests | User flow testing |
| **refactor-cleaner** | Code cleanup | Dead code, optimization |
| **doc-updater** | Documentation | API changes, new features |
| **database-reviewer** | Database review | Schema, queries, migrations |
| **go-reviewer** | Go code review | Go projects |
| **go-build-resolver** | Go build errors | Go compilation issues |
| **designer** | Frontend UI/UX | Styling, animations, responsive design, visual polish |
| **multimodal-looker** | Vision analysis | Screenshots, PDFs, images, diagrams |

### Agent Decision Tree

```
User Request
     │
     ├─── "Build/Create/Add feature" ──────→ planner → architect? → tdd-guide → reviewers
     │
     ├─── "Fix bug" ────────────────────────→ tdd-guide → code-reviewer
     │
     ├─── "Review my code" ─────────────────→ code-reviewer + security-reviewer?
     │
     ├─── "Build is broken" ────────────────→ build-error-resolver
     │
     ├─── "Clean up / refactor" ────────────→ planner → refactor-cleaner → code-reviewer
     │
     ├─── "Update docs" ────────────────────→ doc-updater
     │
     ├─── "Check database/schema" ──────────→ database-reviewer
     │
     ├─── "Design/style the UI" ────────────→ designer → code-reviewer
     │
     └─── "Analyze this screenshot/image" ──→ multimodal-looker
```

### Agent Locations

- **Plugin agents:** `~/.config/opencode/agents/` (installed by `everything-opencode install`)
- **Project agents:** `.opencode/agents/` (project-specific)

---

## Skills

Skills are knowledge documents that agents reference for domain-specific guidance.

### Included Skills

| Skill | Purpose |
|-------|---------|
| `coding-standards` | Language best practices |
| `tdd-workflow` | Test-driven development methodology |
| `continuous-learning` | Auto-extract patterns from sessions |
| `backend-patterns` | API, database, caching patterns |
| `frontend-patterns` | React, Next.js patterns |
| `frontend-ui-ux` | Designer expertise for stunning UI/UX |
| `security-review` | Security checklist |
| `golang-patterns` | Go idioms |
| `golang-testing` | Go testing patterns |
| `postgres-patterns` | PostgreSQL best practices |
| `lsp-validation` | LSP tools for code validation |
| And more... |

### How Skills Are Used

Agents automatically reference relevant skills. For example:
- `tdd-guide` uses the `tdd-workflow` skill
- `security-reviewer` uses the `security-review` skill
- `code-reviewer` uses `coding-standards`
- `designer` uses `frontend-ui-ux` skill

### Skill Locations

- **Plugin skills:** `~/.config/opencode/skills/`
- **Project skills:** `.opencode/skills/`

---

## Hooks

Hooks are automations that fire on specific events.

### Built-in Hooks

| Hook | What It Does |
|------|--------------|
| **Tmux Reminder** | Suggests tmux for long-running commands |
| **Dev Server Blocker** | Blocks dev servers outside tmux |
| **MD File Blocker** | Prevents unnecessary .md file creation |
| **Git Push Reminder** | Reminds to review before pushing |
| **Console.log Warning** | Warns about console.log in code |
| **PR Helper** | Logs PR URL after `gh pr create` |
| **Compaction Suggestion** | Suggests `/compact` every 20 edits |

### Hook Configuration

Create `~/.config/opencode/everything-opencode.json`:

```json
{
  "tmux": {
    "enabled": true,
    "layout": "main-vertical"
  },
  "hooks": {
    "pre_tool_use": {
      "tmux_reminder": true,
      "block_dev_servers": true,
      "git_push_reminder": true
    },
    "post_tool_use": {
      "console_log_warning": true
    }
  }
}
```

---

## Rules

Rules are always-followed guidelines. They're loaded into every session.

### Included Rules

| Rule | Key Points |
|------|------------|
| `security.md` | No hardcoded secrets, validate inputs, parameterized queries |
| `coding-style.md` | Immutability, no emojis in code, files < 400 lines |
| `testing.md` | TDD workflow, 80% coverage target |
| `git-workflow.md` | Conventional commits, PR process |
| `agents.md` | When to delegate, parallel execution |
| `performance.md` | Model selection, context management |

### Rule Locations

- **Plugin rules:** `~/.config/opencode/rules/`
- **Project rules:** `.opencode/rules/` or `AGENTS.md`

---

## MCPs (Model Context Protocol)

MCPs connect OpenCode to external services.

### Context Window Warning

⚠️ **Critical:** Too many MCPs shrink your context window from 200k to 70k.

**Rule of thumb:**
- Configure 20-30 MCPs
- Enable only 5-10 per project
- Keep under 80 total tools

### Configuring MCPs

In `opencode.json`:

```json
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"]
    },
    "supabase": {
      "type": "local", 
      "command": ["npx", "-y", "@supabase/mcp-server-supabase@latest"]
    }
  },
  "disabled_mcps": ["supabase"]
}
```

---

## Context Management

### Session Persistence

The plugin automatically:
- Saves session state on exit
- Loads previous context on start

State is stored in: `~/.config/opencode/.tmp/last-session.md`

### Strategic Compaction

After 20 edits, you'll see:
```
[Hook] Consider running /compact - 20 edits since last compaction
```

**When to compact:**
- After completing a logical unit of work
- Before switching to unrelated tasks
- When context feels cluttered

### Context Injection

Use different modes via aliases:

```bash
alias oc-dev='opencode --system-prompt "$(cat ~/.config/opencode/contexts/dev.md)"'
alias oc-review='opencode --system-prompt "$(cat ~/.config/opencode/contexts/review.md)"'
```

---

## Token Optimization

### Model Selection by Task

| Task | Model | Reasoning |
|------|-------|-----------|
| File search, exploration | Haiku | Fast, cheap |
| Simple edits | Haiku | Clear instructions |
| Multi-file implementation | Sonnet | Best coding balance |
| Complex architecture | Opus | Deep reasoning |
| Security analysis | Opus | Can't miss vulnerabilities |

### Model/Provider Configuration

everything-opencode uses a **preset system** to configure models for all agents. This makes it easy to switch between providers.

#### Quick Start: Choose Your Provider

Create `~/.config/opencode/everything-opencode.json`:

```json
{
  "preset": "anthropic"
}
```

**Built-in presets:**

| Preset | Provider | Description |
|--------|----------|-------------|
| `anthropic` | Anthropic API | Direct Anthropic API (default) |
| `bedrock` | AWS Bedrock | Claude via AWS |
| `github-copilot` | GitHub Copilot | Claude via GitHub |
| `openai` | OpenAI | GPT-4o and o1 models |
| `gemini` | Google | Gemini 2.5 Pro/Flash |

#### Switching Providers

Just change the preset:

```json
{
  "preset": "bedrock"
}
```

Or use environment variable (overrides config):
```bash
export EVERYTHING_OPENCODE_PRESET=github-copilot
```

#### Per-Agent Overrides

Override specific agents while keeping the preset for others:

```json
{
  "preset": "anthropic",
  "agents": {
    "security-reviewer": {
      "model": "anthropic/claude-opus-4-5"
    },
    "doc-updater": {
      "model": "anthropic/claude-haiku-3-5"
    }
  }
}
```

#### Hybrid Setups (Multiple Providers)

Mix providers for cost optimization:

```json
{
  "preset": "anthropic",
  "agents": {
    "doc-updater": { "model": "openai/gpt-4o-mini" },
    "build-error-resolver": { "model": "google/gemini-2.5-flash" }
  }
}
```

#### Custom Presets

Define your own presets:

```json
{
  "preset": "my-custom",
  "presets": {
    "my-custom": {
      "orchestrator": { "model": "anthropic/claude-opus-4-5" },
      "planner": { "model": "openai/gpt-4o" },
      "tdd-guide": { "model": "bedrock/claude-sonnet-4-5" },
      "code-reviewer": { "model": "github-copilot/claude-sonnet-4-5" }
    }
  }
}
```

#### Configuration Priority

1. **Environment variable** (highest): `EVERYTHING_OPENCODE_PRESET`
2. **Project config**: `.opencode/everything-opencode.json`
3. **User config**: `~/.config/opencode/everything-opencode.json`
4. **Built-in defaults** (lowest): `anthropic` preset

#### Model Assignment by Agent

Each preset assigns models based on task complexity:

| Agent | Anthropic | OpenAI | Gemini |
|-------|-----------|--------|--------|
| orchestrator | opus | gpt-4o | pro |
| architect | opus | o3 | pro |
| security-reviewer | opus | o3 | pro |
| tdd-guide | sonnet | gpt-4o | pro |
| code-reviewer | sonnet | gpt-4o | pro |
| build-error-resolver | sonnet | gpt-4o | flash |
| doc-updater | haiku | gpt-4o-mini | flash |

### Optimization Tips

1. **Modular files** - Keep files < 400 lines
2. **Disable unused MCPs** - Saves context
3. **Use subagents** - Cheaper models for simple tasks
4. **Compact strategically** - Don't let context rot

---

## Parallelization

### When to Run Agents in Parallel

Independent tasks can run simultaneously:

```
Parallel review:
├── code-reviewer → src/api/
├── security-reviewer → src/auth/  
└── database-reviewer → migrations/
```

The orchestrator handles this automatically when appropriate.

### Git Worktrees for Parallel Work

```bash
git worktree add ../feature-a feature-a
git worktree add ../feature-b feature-b

# Each worktree gets its own OpenCode instance
cd ../feature-a && opencode
```

---

## Tips and Tricks

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+U` | Delete line |
| `!` | Bash command prefix |
| `@` | Search files |
| `/` | Slash commands |
| `Shift+Enter` | Multi-line input |
| `Esc Esc` | Interrupt |

### tmux Integration

Enable in config for automatic pane management:

```json
{
  "tmux": {
    "enabled": true,
    "layout": "main-vertical"
  }
}
```

### Terminal Aliases

```bash
alias oc='opencode'
alias ocp='/plan'
alias ocr='/code-review'
```

---

## Summary

### Two Interaction Modes

1. **Orchestrated** - Describe what you want, orchestrator handles the rest
2. **Manual** - Use `/commands` for explicit agent control

### The Agent Hierarchy

```
orchestrator (meta-agent)
     │
     ├── planner (planning)
     ├── architect (design)  
     ├── tdd-guide (implementation)
     ├── code-reviewer (quality)
     ├── security-reviewer (security)
     ├── build-error-resolver (fixes)
     ├── e2e-runner (testing)
     ├── refactor-cleaner (cleanup)
     ├── doc-updater (docs)
     └── database-reviewer (database)
```

### Quick Decision Guide

- **Complex task?** → Just describe it (orchestrator handles it)
- **Want control?** → Use `/commands`
- **Simple change?** → Do it directly, no agent needed

---

*Based on patterns from everything-claude-code, adapted for OpenCode.*
