/**
 * everything-opencode
 *
 * Complete OpenCode configuration plugin with agents, skills, hooks, commands.
 * Based on everything-claude-code patterns adapted for OpenCode.
 */

import type { Plugin } from '@opencode-ai/plugin';
import { BackgroundTaskManager, TmuxSessionManager } from './background';
import { type PluginConfig, type TmuxConfig, loadPluginConfig } from './config';
import {
  createCompactionHooks,
  createPostToolUseHooks,
  createPreToolUseHooks,
  createSessionLifecycleHooks,
} from './hooks';
import {
  lsp_diagnostics,
  lsp_find_references,
  lsp_goto_definition,
  lsp_rename,
} from './tools';
import { initToast, log, toast } from './utils';

/**
 * Everything OpenCode Plugin
 *
 * Provides:
 * - Background task management with tmux integration
 * - LSP tools (goto definition, find references, diagnostics, rename)
 * - Pre/Post tool use hooks (tmux reminders, console.log warnings, etc.)
 * - Session lifecycle hooks (context persistence)
 * - Strategic compaction suggestions
 *
 * Agents, skills, commands, and rules are provided as Markdown files
 * in the plugin's directories (agents/, commands/, skills/, rules/).
 */
const EverythingOpenCode: Plugin = async (ctx) => {
  // Load configuration
  const config = loadPluginConfig(ctx.directory);

  // Parse tmux config with defaults
  const tmuxConfig: TmuxConfig = {
    enabled: config.tmux?.enabled ?? false,
    layout: config.tmux?.layout ?? 'main-vertical',
    main_pane_size: config.tmux?.main_pane_size ?? 60,
  };

  log('[everything-opencode] Plugin initialized', {
    directory: ctx.directory,
    tmuxEnabled: tmuxConfig.enabled,
  });

  // Initialize toast notifications
  initToast(ctx, config.notifications);

  // Initialize managers
  const backgroundManager = new BackgroundTaskManager(ctx, tmuxConfig, config);
  const tmuxSessionManager = new TmuxSessionManager(ctx, tmuxConfig);

  // Initialize hooks
  const preToolUseHook = createPreToolUseHooks({
    enabled: {
      tmuxReminder: true,
      blockDevServersOutsideTmux: tmuxConfig.enabled,
      blockUnnecessaryMdFiles: true,
      gitPushReminder: true,
    },
  });

  const postToolUseHooks = createPostToolUseHooks({
    enabled: {
      consoleLogWarning: true,
      prCreationHelper: true,
      typescriptCheck: false,
    },
  });

  const sessionLifecycleHooks = createSessionLifecycleHooks({
    contextPersistence: true,
  });

  const compactionHooks = createCompactionHooks({
    threshold: 20,
    onSuggestion: (editCount) => {
      toast.info(
        'Compaction Suggested',
        `${editCount} edits since last compaction. Consider running /compact`,
      );
    },
  });

  return {
    name: 'everything-opencode',

    // LSP Tools
    tool: {
      lsp_goto_definition,
      lsp_find_references,
      lsp_diagnostics,
      lsp_rename,
    },

    // Event handler for session lifecycle
    event: async (input) => {
      const event = input.event as {
        type: string;
        properties?: Record<string, unknown>;
      };

      // Handle background task completion
      await backgroundManager.handleSessionStatus({
        type: event.type,
        properties: event.properties as {
          sessionID?: string;
          status?: { type: string };
        },
      });

      // Handle tmux pane management
      if (event.type === 'session.created') {
        await tmuxSessionManager.onSessionCreated({
          type: event.type,
          properties: event.properties as {
            info?: { id?: string; parentID?: string; title?: string };
          },
        });
        await sessionLifecycleHooks.onSessionCreated();
      }

      if (event.type === 'session.idle') {
        await sessionLifecycleHooks.onSessionIdle();
      }

      await tmuxSessionManager.onSessionStatus({
        type: event.type,
        properties: event.properties as {
          sessionID?: string;
          status?: { type: string };
        },
      });
    },

    // Pre-tool-use hooks
    'tool.execute.before': async (input, output) => {
      // Adapt OpenCode's input format to our hook format
      const toolInput = {
        tool: input.tool,
        args: output.args as Record<string, unknown>,
      };
      await preToolUseHook(toolInput, {});
    },

    // Post-tool-use hooks
    'tool.execute.after': async (input, output) => {
      const args = (output as { args?: Record<string, unknown> }).args ?? {};
      const toolOutput = (output as { output?: string }).output ?? '';

      // Track edits for compaction suggestion
      if (input.tool === 'edit' || input.tool === 'write') {
        compactionHooks.trackEdit();
      }

      // Check for console.log in edited files
      if (input.tool === 'edit' || input.tool === 'write') {
        const filePath = (args.filePath ?? args.file_path ?? '') as string;
        if (filePath) {
          await postToolUseHooks.checkConsoleLog(filePath);
        }
      }

      // Check for PR creation
      if (input.tool === 'bash') {
        const command = (args.command ?? '') as string;
        postToolUseHooks.logPrUrl(command, toolOutput);
      }
    },

    // Config handler - inject agent models from preset
    config: async (opencodeConfig: Record<string, unknown>) => {
      log('[everything-opencode] Configuring OpenCode', {
        hasExistingConfig: !!opencodeConfig,
        preset: config.preset,
        disableDefaultAgents: config.disable_default_agents,
      });

      // Ensure agent config object exists
      if (!opencodeConfig.agent) {
        opencodeConfig.agent = {};
      }
      const agentConfig = opencodeConfig.agent as Record<
        string,
        Record<string, unknown>
      >;

      // Optionally disable OpenCode's default agents that overlap with ours
      if (config.disable_default_agents) {
        const defaultAgentsToDisable = ['plan', 'build', 'codebase'];
        for (const agentName of defaultAgentsToDisable) {
          if (!agentConfig[agentName]) {
            agentConfig[agentName] = {};
          }
          agentConfig[agentName].disable = true;
          log(`[everything-opencode] Disabled default agent: ${agentName}`);
        }
      }

      // Inject agent configurations with resolved models from preset
      // This allows agent markdown files to omit `model:` - we set it dynamically
      if (config.agents) {
        for (const [agentName, agentOverride] of Object.entries(
          config.agents,
        )) {
          if (!agentOverride.model) continue;

          // Merge with existing agent config (don't overwrite user's opencode.json settings)
          if (!agentConfig[agentName]) {
            agentConfig[agentName] = {};
          }

          // Only set model if not already configured in opencode.json
          if (!agentConfig[agentName].model) {
            agentConfig[agentName].model = agentOverride.model;
            log(
              `[everything-opencode] Set ${agentName} model to ${agentOverride.model}`,
            );
          }
        }
      }
    },
  };
};

export default EverythingOpenCode;

// Only export types - OpenCode's plugin loader will try to call
// all non-type exports as functions, which breaks classes
export type { PluginConfig, TmuxConfig } from './config';
export type { HookConfig } from './hooks';
export type { BackgroundTask, LaunchOptions } from './background';
