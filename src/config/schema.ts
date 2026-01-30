import { z } from 'zod';

// Agent override configuration (distinct from SDK's AgentConfig)
export const AgentOverrideConfigSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  variant: z.string().optional().catch(undefined),
  skills: z.array(z.string()).optional(), // skills this agent can use ("*" = all, "!item" = exclude)
  mcps: z.array(z.string()).optional(), // MCPs this agent can use ("*" = all, "!item" = exclude)
});

// Tmux layout options
export const TmuxLayoutSchema = z.enum([
  'main-horizontal', // Main pane on top, agents stacked below
  'main-vertical', // Main pane on left, agents stacked on right
  'tiled', // All panes equal size grid
  'even-horizontal', // All panes side by side
  'even-vertical', // All panes stacked vertically
]);

export type TmuxLayout = z.infer<typeof TmuxLayoutSchema>;

// Tmux integration configuration
export const TmuxConfigSchema = z.object({
  enabled: z.boolean().default(false),
  layout: TmuxLayoutSchema.default('main-vertical'),
  main_pane_size: z.number().min(20).max(80).default(60), // percentage for main pane
});

export type TmuxConfig = z.infer<typeof TmuxConfigSchema>;

export type AgentOverrideConfig = z.infer<typeof AgentOverrideConfigSchema>;

export const PresetSchema = z.record(z.string(), AgentOverrideConfigSchema);

export type Preset = z.infer<typeof PresetSchema>;

// MCP names
export const McpNameSchema = z.enum(['websearch', 'context7', 'grep_app']);
export type McpName = z.infer<typeof McpNameSchema>;

// Background task configuration
export const BackgroundTaskConfigSchema = z.object({
  maxConcurrentStarts: z.number().min(1).max(50).default(10),
});

export type BackgroundTaskConfig = z.infer<typeof BackgroundTaskConfigSchema>;

// Notification configuration
export const NotificationConfigSchema = z.object({
  // Show toast notifications in the UI (default: true)
  enabled: z.boolean().default(true),
  // Duration in milliseconds (default: 3000)
  duration: z.number().min(1000).max(30000).default(3000),
});

export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;

// Main plugin config
export const PluginConfigSchema = z.object({
  // Active preset name (e.g., "anthropic", "bedrock", "github-copilot")
  preset: z.string().optional(),
  // Custom presets (user-defined, can override built-in presets)
  presets: z.record(z.string(), PresetSchema).optional(),
  // Per-agent overrides (overrides preset values)
  agents: z.record(z.string(), AgentOverrideConfigSchema).optional(),
  // MCPs to disable
  disabled_mcps: z.array(z.string()).optional(),
  // Disable OpenCode's default agents that overlap with ours (plan, build, codebase)
  disable_default_agents: z.boolean().optional(),
  // Toast notifications in the UI
  notifications: NotificationConfigSchema.optional(),
  // Tmux integration
  tmux: TmuxConfigSchema.optional(),
  // Background task settings
  background: BackgroundTaskConfigSchema.optional(),
});

export type PluginConfig = z.infer<typeof PluginConfigSchema>;
