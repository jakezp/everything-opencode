/**
 * Pre-tool-use hooks
 * Executed before tool use to provide warnings and validation
 */

/**
 * Configuration for pre-tool-use hooks
 */
export interface PreToolUseConfig {
  /**
   * Enable/disable specific hooks
   * Default: all enabled
   */
  enabled?: {
    /** Warn when running dev/build commands outside tmux (default: true) */
    tmuxReminder?: boolean;
    /** Block dev server commands outside tmux (default: true) */
    blockDevServersOutsideTmux?: boolean;
    /** Block unnecessary markdown file creation (default: true) */
    blockUnnecessaryMdFiles?: boolean;
    /** Remind before git push (default: true) */
    gitPushReminder?: boolean;
  };
}

/**
 * Tool input/output types for hooks
 */
export interface ToolInput {
  tool: string;
  args?: Record<string, unknown>;
}

export interface ToolOutput {
  [key: string]: unknown;
}

/**
 * Create pre-tool-use hooks
 * Returns an async function that validates tool usage before execution
 */
export function createPreToolUseHooks(config?: PreToolUseConfig) {
  const enabled = {
    tmuxReminder: config?.enabled?.tmuxReminder !== false,
    blockDevServersOutsideTmux:
      config?.enabled?.blockDevServersOutsideTmux !== false,
    blockUnnecessaryMdFiles: config?.enabled?.blockUnnecessaryMdFiles !== false,
    gitPushReminder: config?.enabled?.gitPushReminder !== false,
  };

  /**
   * Check if we're running inside tmux
   */
  function isInsideTmux(): boolean {
    return !!process.env.TMUX;
  }

  /**
   * Check if a bash command matches a pattern
   */
  function bashCommandMatches(command: string, patterns: string[]): boolean {
    const normalizedCmd = command.trim().toLowerCase();
    return patterns.some((pattern) => new RegExp(pattern).test(normalizedCmd));
  }

  /**
   * Hook 1: Tmux Reminder - warn when running dev/build commands outside tmux
   */
  function checkTmuxReminder(
    toolName: string,
    args: Record<string, unknown>,
  ): void {
    if (!enabled.tmuxReminder || toolName !== 'bash') return;

    const command = String(args.command ?? '').trim();
    if (!command) return;

    const devCommandPatterns = [
      '(npm|pnpm|yarn|bun)\\s+(install|test)',
      'cargo\\s+build',
      'pytest',
      'vitest',
      'playwright',
    ];

    if (bashCommandMatches(command, devCommandPatterns) && !isInsideTmux()) {
      console.error(
        `[Hook] WARNING: Running development/build command outside tmux: ${command}`,
      );
      console.error(
        '[Hook] Consider running this inside a tmux session for better isolation',
      );
      console.error(
        '[Hook] Suggestion: tmux new-session -d -s work && tmux send-keys -t work "cd <project> && <command>" Enter',
      );
    }
  }

  /**
   * Hook 2: Block Dev Servers Outside Tmux
   */
  function blockDevServersOutsideTmux(
    toolName: string,
    args: Record<string, unknown>,
  ): void {
    if (!enabled.blockDevServersOutsideTmux || toolName !== 'bash') return;

    const command = String(args.command ?? '').trim();
    if (!command) return;

    const devServerPattern = '(npm|pnpm|yarn|bun)\\s+run\\s+dev';

    if (bashCommandMatches(command, [devServerPattern]) && !isInsideTmux()) {
      throw new Error(
        `[Hook] BLOCKED: Development server commands must run inside tmux for proper session management.\nCommand: ${command}\nSolution: Start a tmux session first:\n  tmux new-session -d -s dev\n  tmux send-keys -t dev "cd /path/to/project && npm run dev" Enter\nThen run your OpenCode command in the main terminal.`,
      );
    }
  }

  /**
   * Hook 3: Block Unnecessary MD Files
   */
  function blockUnnecessaryMdFiles(
    toolName: string,
    args: Record<string, unknown>,
  ): void {
    if (!enabled.blockUnnecessaryMdFiles || toolName !== 'write') return;

    const filePath = String(args.filePath ?? '').trim();
    if (!filePath) return;

    const isMarkdownFile = /\.(md|txt)$/i.test(filePath);
    if (!isMarkdownFile) return;

    // Allowed markdown files
    const allowedFiles = [
      'README.md',
      'CLAUDE.md',
      'AGENTS.md',
      'CONTRIBUTING.md',
    ];

    const fileName = filePath.split('/').pop() || '';
    const isAllowed = allowedFiles.includes(fileName);

    if (!isAllowed) {
      throw new Error(
        `[Hook] BLOCKED: Creating unnecessary markdown/text file: ${fileName}\n\nAllowed documentation files:\n  - README.md (main project documentation)\n  - CLAUDE.md (Claude-specific notes)\n  - AGENTS.md (agent configuration)\n  - CONTRIBUTING.md (contribution guide)\n\nSuggestion: If you need to document something, update README.md instead.`,
      );
    }
  }

  /**
   * Hook 4: Git Push Reminder
   */
  function gitPushReminder(
    toolName: string,
    args: Record<string, unknown>,
  ): void {
    if (!enabled.gitPushReminder || toolName !== 'bash') return;

    const command = String(args.command ?? '').trim();
    if (!command) return;

    if (bashCommandMatches(command, ['^git\\s+push'])) {
      console.error('[Hook] REMINDER: Review your changes before pushing:');
      console.error('[Hook]   git diff HEAD');
      console.error('[Hook]   git log --oneline -5');
      console.error('[Hook]   git status');
    }
  }

  /**
   * Main hook executor
   */
  return async (input: ToolInput, output: ToolOutput): Promise<void> => {
    const toolName = input.tool || '';
    const args = (input.args || {}) as Record<string, unknown>;

    // Execute all checks in order
    checkTmuxReminder(toolName, args);
    blockDevServersOutsideTmux(toolName, args);
    blockUnnecessaryMdFiles(toolName, args);
    gitPushReminder(toolName, args);
  };
}

export type PreToolUseHooks = ReturnType<typeof createPreToolUseHooks>;
