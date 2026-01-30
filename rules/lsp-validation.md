# LSP Validation Rule

## Mandatory LSP Checks

All agents with write access MUST validate code using LSP tools.

### After Any Code Edit

```
1. Run lsp_diagnostics(filePath, severity: "error")
2. If errors found → FIX before proceeding
3. Do NOT mark task complete with LSP errors
```

### Before Declaring Task Complete

```
1. Run lsp_diagnostics on ALL modified files
2. Ensure zero errors
3. Review and address warnings if appropriate
```

### For Code Reviews

```
1. Run lsp_diagnostics on files under review
2. Report any errors/warnings as review findings
3. Use lsp_find_references to verify refactoring safety
```

## Agent Responsibilities

| Agent | LSP Requirement |
|-------|-----------------|
| tdd-guide | MUST run diagnostics after implementation |
| code-reviewer | MUST check diagnostics during review |
| build-error-resolver | MUST use diagnostics to identify issues |
| refactor-cleaner | MUST check references before removal |
| orchestrator | MUST verify no errors after delegated work |

## Quick Reference

```
# Check for errors
lsp_diagnostics(filePath: "path/to/file.ts", severity: "error")

# Check all issues
lsp_diagnostics(filePath: "path/to/file.ts", severity: "all")

# Find all usages before refactoring
lsp_find_references(filePath: "path", line: N, character: N)

# Safe rename
lsp_rename(filePath: "path", line: N, character: N, newName: "new")
```

## No Exceptions

- Do NOT skip LSP validation to save time
- Do NOT ignore errors "for now"
- Do NOT complete tasks with unresolved LSP errors
