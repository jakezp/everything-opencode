# everything-opencode

Complete OpenCode configuration - agents, skills, hooks, commands, rules. Battle-tested patterns from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) adapted for OpenCode.

## Features

- **16 Specialized Agents** - Planner, architect, code-reviewer, tdd-guide, security-reviewer, designer, multimodal-looker, fixer, and more
- **25 Slash Commands** - /plan, /tdd, /e2e, /code-review, /build-fix, /refactor-clean, /design, /analyze-visual, etc.
- **24 Skills** - Coding standards, TDD workflow, continuous learning, verification loops, frontend UI/UX, LSP validation
- **9 Rule Sets** - Security, coding style, testing, git workflow, LSP validation guidelines
- **Smart Hooks** - Pre/post tool use hooks for tmux reminders, console.log warnings, TypeScript checks
- **LSP Tools** - Go-to-definition, find-references, diagnostics, rename
- **Background Task Management** - With optional tmux integration
- **Flexible Model Configuration** - Presets + per-agent overrides, mix providers freely

## Installation

```bash
# Install the package
npm install -g everything-opencode

# Install agents, commands, skills, rules to your config
everything-opencode install
```

This copies all components to `~/.config/opencode/`.

## Configuration

Add to your `opencode.json`:

```json
{
  "plugin": ["everything-opencode"]
}
```

### Model Configuration

Configure agent models in `~/.config/opencode/everything-opencode.json`.

#### Quick Start: Use a Preset

```json
{
  "preset": "github-copilot"
}
```

**Available Presets** (each uses only that provider's models):

| Preset | Provider | Models |
|--------|----------|--------|
| `github-copilot` | GitHub Copilot | claude-opus-4-5, claude-sonnet-4-5, claude-haiku-3-5 |
| `anthropic` | Anthropic | claude-opus-4-5, claude-sonnet-4-5, claude-haiku-3-5 |
| `bedrock` | AWS Bedrock | claude-opus-4-5, claude-sonnet-4-5, claude-haiku-3-5 |
| `google` | Google | gemini-3-pro-high, gemini-3-flash |
| `openai` | OpenAI | gpt-4o, o3, gpt-4o-mini |

#### Mix Providers with Agent Overrides

Use a preset as base, then override specific agents with different providers:

```json
{
  "preset": "github-copilot",
  "agents": {
    "designer": { "model": "google/gemini-3-pro-high" },
    "multimodal-looker": { "model": "google/gemini-3-flash" }
  }
}
```

This gives you Claude via GitHub Copilot for most agents, but Gemini for vision/design tasks.

#### Override Any Agent

Each agent can be configured individually:

```json
{
  "preset": "anthropic",
  "agents": {
    "orchestrator": { "model": "anthropic/claude-opus-4-5" },
    "doc-updater": { "model": "openai/gpt-4o-mini" },
    "designer": { "model": "google/gemini-3-pro-high" }
  }
}
```

#### Environment Variable Override

Switch presets without editing config:

```bash
EVERYTHING_OPENCODE_PRESET=bedrock opencode
```

#### Project-Level Overrides

Create `.opencode/everything-opencode.json` in your project root to override settings per-project:

```json
{
  "agents": {
    "build-error-resolver": { "model": "anthropic/claude-opus-4-5" }
  }
}
```

**Configuration Priority** (highest to lowest):
1. Environment variable (`EVERYTHING_OPENCODE_PRESET`)
2. Project config (`.opencode/everything-opencode.json`)
3. User config (`~/.config/opencode/everything-opencode.json`)
4. Built-in preset defaults

### Disable OpenCode Default Agents (Optional)

OpenCode includes default agents (`plan`, `build`, `codebase`) that overlap with ours (`planner`, `build-error-resolver`). To disable the defaults and use only our agents:

```json
{
  "preset": "github-copilot",
  "disable_default_agents": true
}
```

This is optional - by default both sets of agents are available.

### Tmux Integration (Optional)

Enable tmux for parallel session management:

```json
{
  "preset": "github-copilot",
  "tmux": {
    "enabled": true,
    "layout": "main-vertical",
    "main_pane_size": 60
  }
}
```

## What's Included

### Agents (16)

| Agent | Purpose |
|-------|---------|
| `orchestrator` | Multi-agent coordination and task delegation |
| `planner` | Implementation planning for complex features |
| `architect` | System design and architectural decisions |
| `code-reviewer` | Code quality and security review |
| `tdd-guide` | Test-driven development guidance |
| `security-reviewer` | Security vulnerability analysis |
| `build-error-resolver` | Fix build and compilation errors |
| `e2e-runner` | End-to-end test generation |
| `refactor-cleaner` | Dead code removal and refactoring |
| `doc-updater` | Documentation updates |
| `go-reviewer` | Go-specific code review |
| `go-build-resolver` | Go build error resolution |
| `database-reviewer` | Database schema and query review |
| `designer` | Frontend UI/UX specialist |
| `multimodal-looker` | Vision analysis (screenshots, PDFs, images) |
| `fixer` | Fast implementation for well-defined tasks |

### Commands (25)

| Command | Description |
|---------|-------------|
| `/plan` | Create implementation plan |
| `/tdd` | Test-driven development workflow |
| `/e2e` | Generate E2E tests |
| `/code-review` | Review code quality |
| `/build-fix` | Fix build errors |
| `/refactor-clean` | Clean up dead code |
| `/design` | UI/UX design and implementation |
| `/analyze-visual` | Analyze screenshots/images/PDFs |
| `/learn` | Extract patterns mid-session |
| `/checkpoint` | Save verification state |
| `/verify` | Run verification loop |
| `/orchestrate` | Multi-agent orchestration |
| `/eval` | Evaluate session/code quality |
| `/evolve` | Evolve learned patterns |
| `/go-build` | Fix Go build errors |
| `/go-review` | Go-specific code review |
| `/go-test` | Go TDD workflow |
| `/instinct-export` | Export learned patterns |
| `/instinct-import` | Import learned patterns |
| `/instinct-status` | Show continuous learning status |
| `/setup-pm` | Setup project management |
| `/skill-create` | Create new skill from template |
| `/test-coverage` | Analyze test coverage |
| `/update-codemaps` | Update code maps |
| `/update-docs` | Update documentation |

### Skills (24)

- `coding-standards` - Language best practices
- `tdd-workflow` - TDD methodology
- `continuous-learning` - Auto-extract patterns from sessions
- `backend-patterns` - API, database, caching patterns
- `frontend-patterns` - React, Next.js patterns
- `frontend-ui-ux` - Design principles and styling
- `security-review` - Security checklist
- `golang-patterns` - Go idioms and best practices
- `lsp-validation` - Type-safe code validation
- And more...

### Hooks

**Pre-Tool-Use:**
- Tmux reminder for long-running commands
- Block dev servers outside tmux
- Block unnecessary markdown file creation
- Git push reminder

**Post-Tool-Use:**
- Console.log warning after file edits
- PR creation helper
- Optional TypeScript checking

**Session Lifecycle:**
- Context persistence across sessions

**Compaction:**
- Strategic compaction suggestions every 20 edits

## CLI Commands

```bash
everything-opencode install   # Copy components to ~/.config/opencode/
everything-opencode version   # Show version
everything-opencode help      # Show help
```

## Project Structure

```
everything-opencode/
├── agents/      # Markdown agent definitions
├── commands/    # Slash command definitions
├── skills/      # Skill directories with SKILL.md
├── rules/       # Always-follow guidelines
├── contexts/    # Dynamic context injection files
└── src/         # Plugin TypeScript code
```

## Credits

Based on [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by [@affaanmustafa](https://x.com/affaanmustafa), adapted for [OpenCode](https://opencode.ai).

Background task management and LSP tools ported from [oh-my-opencode-custom](https://github.com/alvinunreal/oh-my-opencode-custom).

## License

MIT
