# Agent Coding Guidelines

Guidelines for AI agents operating in this repository.

## Project Overview

**everything-opencode** - Complete OpenCode configuration plugin with agents, skills, hooks, commands. Built with TypeScript, Bun, and Biome.

## Commands

| Command | Description |
|---------|-------------|
| `bun run build` | Build plugin and CLI to `dist/` |
| `bun run typecheck` | Run TypeScript type checking |
| `bun test` | Run all tests |
| `bun test <file>` | Run a specific test file |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format with Biome |
| `bun run check` | Lint + format + organize imports |
| `bun run check:ci` | CI check (no write) |

## Code Style

### Formatting & Linting
- **Formatter:** Biome (`biome.json`)
- **Indentation:** 2 spaces
- **Line Width:** 80 characters
- **Quotes:** Single quotes (`'`)
- **Semicolons:** Always
- **Trailing Commas:** Always (multiline)

### TypeScript
- **Strict Mode:** Enabled
- **Types:** Use explicit types. Avoid `any` (`noExplicitAny` rule is warn).
- **Interfaces:** Use `interface` for object definitions, `type` for unions/primitives.
- **Async/Await:** Prefer `async/await` over raw Promises.
- **Imports:**
  - Organize imports automatically (Biome handles this).
  - Use named exports for consistency.

### Naming Conventions
- **Files:** `kebab-case.ts` (e.g., `background-manager.ts`)
- **Classes:** `PascalCase` (e.g., `BackgroundTaskManager`)
- **Variables/Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE` (for global constants)
- **Interfaces:** `PascalCase` (no `I` prefix)

### Error Handling
- Use structured error handling.
- Log errors using the logger utility (`src/utils/logger.ts`).
- Propagate errors when they cannot be handled locally.

## Project Structure

```
everything-opencode/
├── src/              # TypeScript source
│   ├── index.ts      # Main plugin entry
│   ├── background/   # Background task management
│   ├── hooks/        # Hook implementations
│   ├── tools/        # LSP and other tools
│   ├── config/       # Configuration system
│   ├── cli/          # CLI entry point
│   └── utils/        # Shared utilities
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
- `biome.json` - Linter/Formatter configuration
- `package.json` - Dependencies and scripts

## Development Workflow

1. **Make Changes:** Implement features or fixes.
2. **Lint/Format:** Run `bun run check` to format and fix lint issues.
3. **Typecheck:** Run `bun run typecheck` to ensure type safety.
4. **Build:** Run `bun run build` to verify the build process.
5. **Test:** Run `bun test` (if tests exist).
6. **Verify:** Ensure no errors in the build output.

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
