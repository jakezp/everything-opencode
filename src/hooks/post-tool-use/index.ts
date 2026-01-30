import { existsSync } from 'node:fs';
/**
 * Post-tool-use hooks
 * Executed after tool use to provide warnings and helpful information
 */
import { readFile } from 'node:fs/promises';

export interface PostToolUseConfig {
  /**
   * Enable/disable specific hooks
   * Default: all enabled
   */
  enabled?: {
    /** Console.log warnings after file edits (default: true) */
    consoleLogWarning?: boolean;
    /** PR creation helper after gh pr create (default: true) */
    prCreationHelper?: boolean;
    /** TypeScript check after .ts/.tsx edits (default: false - disabled for performance) */
    typescriptCheck?: boolean;
  };
}

export function createPostToolUseHooks(config?: PostToolUseConfig) {
  const enabled = {
    consoleLogWarning: config?.enabled?.consoleLogWarning !== false,
    prCreationHelper: config?.enabled?.prCreationHelper !== false,
    typescriptCheck: config?.enabled?.typescriptCheck === true, // Disabled by default
  };

  return {
    /**
     * Check for console.log after file edits
     */
    async checkConsoleLog(filePath: string): Promise<void> {
      if (!enabled.consoleLogWarning) return;

      // Only check supported file types
      if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) return;

      try {
        if (!existsSync(filePath)) return;

        const content = await readFile(filePath, 'utf8');
        const lines = content.split('\n');
        const matches: Array<{ line: number; text: string }> = [];

        lines.forEach((line, idx) => {
          if (/console\.log/.test(line)) {
            matches.push({
              line: idx + 1,
              text: line.trim(),
            });
          }
        });

        if (matches.length > 0) {
          console.error(`[Hook] WARNING: console.log found in ${filePath}`);
          matches.slice(0, 5).forEach((m) => {
            console.error(`  Line ${m.line}: ${m.text}`);
          });
          if (matches.length > 5) {
            console.error(`  ... and ${matches.length - 5} more`);
          }
          console.error('[Hook] Remove console.log before committing');
        }
      } catch (error) {
        // Silently fail if file can't be read
      }
    },

    /**
     * Log PR URL and provide review command after PR creation
     */
    logPrUrl(command: string, output: string): void {
      if (!enabled.prCreationHelper) return;

      if (!/gh pr create/.test(command)) return;

      // Extract PR URL from output
      const prMatch = output.match(
        /https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/,
      );
      if (prMatch) {
        const prUrl = prMatch[0];
        console.error(`[Hook] PR created: ${prUrl}`);

        // Extract repo and PR number for convenient review command
        const repoMatch = prUrl.match(
          /https:\/\/github\.com\/(.+)\/pull\/(\d+)/,
        );
        if (repoMatch) {
          const repo = repoMatch[1];
          const prNum = repoMatch[2];
          console.error(
            `[Hook] To review: gh pr review ${prNum} --repo ${repo}`,
          );
        }
      }
    },

    /**
     * Run TypeScript type check (optional, disabled by default for performance)
     */
    async runTypescriptCheck(filePath: string): Promise<void> {
      if (!enabled.typescriptCheck) return;

      // Only check TypeScript files
      if (!/\.(ts|tsx)$/.test(filePath)) return;

      try {
        if (!existsSync(filePath)) return;

        // Dynamic import to avoid requiring typescript as a dependency
        const { execSync } = await import('node:child_process');
        const path = await import('node:path');
        const fs = await import('node:fs');

        let dir = path.dirname(filePath);
        let found = false;

        // Walk up to find tsconfig.json
        while (dir !== path.dirname(dir)) {
          if (fs.existsSync(path.join(dir, 'tsconfig.json'))) {
            found = true;
            break;
          }
          dir = path.dirname(dir);
        }

        if (!found) return;

        try {
          execSync('npx tsc --noEmit --pretty false 2>&1', {
            cwd: dir,
            stdio: ['pipe', 'pipe', 'pipe'],
            encoding: 'utf8',
          });
        } catch (e: unknown) {
          const execError = e as { stdout?: string; stderr?: string };
          const output = execError.stdout || execError.stderr || '';
          const lines = output
            .split('\n')
            .filter((l: string) => l.includes(filePath))
            .slice(0, 10);

          if (lines.length > 0) {
            console.error('[Hook] TypeScript errors found:');
            lines.forEach((l: string) => console.error(`  ${l}`));
          }
        }
      } catch (error) {
        // Silently fail if type check can't run
      }
    },
  };
}

export type PostToolUseHooks = ReturnType<typeof createPostToolUseHooks>;
