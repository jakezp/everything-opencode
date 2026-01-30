# Agent Coding Guidelines

Guidelines for AI agents operating in this repository.

## Project Overview

**everything-opencode** - Complete OpenCode configuration plugin with agents, skills, hooks, commands. Built with TypeScript, Bun, and Biome.

## Commands

| Command | Description |
|---------|-------------|
| `bun run build` | Build plugin and CLI to `dist/` |
| `bun run typecheck` | Run TypeScript type checking |
| `bun test` | Run tests |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format with Biome |
| `bun run check` | Lint + format + organize imports |

## Code Style

- **Formatter/Linter:** Biome (configured in `biome.json`)
- **Line width:** 80 characters
- **Indentation:** 2 spaces
- **Quotes:** Single quotes
- **Trailing commas:** Always

## Project Structure

```
everything-opencode/
├── src/              # TypeScript source
│   ├── index.ts      # Main plugin entry
│   ├── background/   # Background task management
│   ├── hooks/        # Hook implementations
│   ├── tools/        # LSP and other tools
│   ├── config/       # Configuration system
│   └── cli/          # CLI entry point
├── agents/           # Markdown agent definitions
├── commands/         # Slash command definitions
├── skills/           # Skill directories
├── rules/            # Always-follow rules
├── contexts/         # Dynamic context files
└── dist/             # Build output
```

## Key Files

- `src/index.ts` - Plugin entry point
- `src/hooks/` - Pre/post tool hooks, session lifecycle, compaction
- `src/background/` - BackgroundTaskManager, TmuxSessionManager
- `src/tools/lsp/` - LSP tools (goto definition, find refs, etc.)

## Development Workflow

1. Make code changes
2. Run `bun run check:ci` to verify linting
3. Run `bun run typecheck` to verify types
4. Run `bun run build` to verify build
5. Test with `bun run dev`

## Adding New Components

### New Agent
Create `agents/<name>.md` with frontmatter:
```markdown
---
name: my-agent
description: What this agent does
tools: ["Read", "Grep", "Glob"]
model: opus
---

You are...
```

### New Command
Create `commands/<name>.md` with frontmatter:
```markdown
---
description: What this command does
agent: optional-agent-name
---

Command instructions...
```

### New Skill
Create `skills/<name>/SKILL.md`:
```markdown
---
name: my-skill
description: What this skill provides
---

# My Skill

Skill content...
```

### New Hook
Add to appropriate directory in `src/hooks/` and export from index.
