/**
 * Toast notification utility for OpenCode TUI
 */

import type { PluginInput } from '@opencode-ai/plugin';
import type { NotificationConfig } from '../config/schema';

export interface ToastOptions {
  title: string;
  message: string;
  variant?: 'info' | 'success' | 'error';
  duration?: number;
}

// Module-level state for the toast utility
let pluginCtx: PluginInput | null = null;
let notificationConfig: NotificationConfig = { enabled: true, duration: 3000 };

/**
 * Initialize the toast utility with plugin context and config
 */
export function initToast(ctx: PluginInput, config?: NotificationConfig): void {
  pluginCtx = ctx;
  if (config) {
    notificationConfig = config;
  }
}

/**
 * Show a toast notification in the OpenCode TUI
 * Falls back silently if notifications are disabled or context not initialized
 */
export function showToast(options: ToastOptions): void {
  if (!notificationConfig.enabled || !pluginCtx) {
    return;
  }

  const { title, message, variant = 'info', duration } = options;

  // Use the undocumented but functional TUI API
  // biome-ignore lint/suspicious/noExplicitAny: TUI API is undocumented, no types available
  const client = pluginCtx.client as any;

  if (client.tui?.showToast) {
    client.tui
      .showToast({
        body: {
          title,
          message,
          variant,
          duration: duration ?? notificationConfig.duration ?? 3000,
        },
      })
      .catch(() => {
        // Silently fail if toast fails
      });
  }
}

/**
 * Convenience methods for common toast types
 */
export const toast = {
  info: (title: string, message: string, duration?: number) =>
    showToast({ title, message, variant: 'info', duration }),

  success: (title: string, message: string, duration?: number) =>
    showToast({ title, message, variant: 'success', duration }),

  error: (title: string, message: string, duration?: number) =>
    showToast({ title, message, variant: 'error', duration }),
};
