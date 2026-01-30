/**
 * Session lifecycle hooks for context persistence
 * Manages saving and restoring session context across sessions
 */

import { promises as fs } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface SessionLifecycleConfig {
  /** Enable context persistence (default: true) */
  contextPersistence?: boolean;
  /** Custom config directory (default: ~/.config/opencode) */
  configDir?: string;
}

interface SessionState {
  timestamp: number;
  info: string;
}

export function createSessionLifecycleHooks(config?: SessionLifecycleConfig) {
  const contextPersistenceEnabled = config?.contextPersistence ?? true;
  const configDir = config?.configDir ?? join(homedir(), '.config', 'opencode');
  const tmpDir = join(configDir, '.tmp');
  const lastSessionPath = join(tmpDir, 'last-session.md');

  /**
   * Ensure tmp directory exists
   */
  async function ensureTmpDir(): Promise<void> {
    try {
      await fs.mkdir(tmpDir, { recursive: true });
    } catch (error) {
      // Directory may already exist, continue
    }
  }

  /**
   * Load previous session context if available
   */
  async function loadPreviousSessionContext(): Promise<string | null> {
    if (!contextPersistenceEnabled) {
      return null;
    }

    try {
      const content = await fs.readFile(lastSessionPath, 'utf-8');
      return content;
    } catch (error) {
      // File doesn't exist or can't be read, return null
      return null;
    }
  }

  /**
   * Save current session state
   */
  async function saveSessionState(info: string): Promise<void> {
    if (!contextPersistenceEnabled) {
      return;
    }

    try {
      await ensureTmpDir();

      const state: SessionState = {
        timestamp: Date.now(),
        info,
      };

      const content = `# OpenCode Session Context
Generated: ${new Date(state.timestamp).toISOString()}

## Session Info
${state.info}

---
This file is automatically managed and may be overwritten on session changes.
`;

      await fs.writeFile(lastSessionPath, content, 'utf-8');
    } catch (error) {
      // Silently fail if we can't save state
      console.error('[Session Lifecycle] Failed to save session state:', error);
    }
  }

  return {
    /**
     * Handle session creation event
     * Loads previous session context if available (silently - no console output)
     */
    async onSessionCreated(): Promise<void> {
      // Silently load previous context - no console.log to avoid TUI interference
      // The context is available via hasPreviousContext() and getSessionContextPath()
      try {
        await loadPreviousSessionContext();
      } catch {
        // Silently fail
      }
    },

    /**
     * Handle session idle/end event
     * Saves current session state for future recovery
     */
    async onSessionIdle(): Promise<void> {
      try {
        const sessionInfo = `Created at: ${new Date().toISOString()}
Session status: idle`;

        await saveSessionState(sessionInfo);
        // Silent save - no logging to avoid TUI spam
      } catch (error) {
        // Silently fail
      }
    },

    /**
     * Get the path where session context is stored
     */
    getSessionContextPath(): string {
      return lastSessionPath;
    },

    /**
     * Check if a previous session context exists
     */
    async hasPreviousContext(): Promise<boolean> {
      try {
        await fs.access(lastSessionPath);
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Clear the saved session context
     */
    async clearSessionContext(): Promise<void> {
      try {
        await fs.unlink(lastSessionPath);
      } catch (error) {
        // File may not exist, which is fine
      }
    },
  };
}

export type SessionLifecycleHooks = ReturnType<
  typeof createSessionLifecycleHooks
>;
