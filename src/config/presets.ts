import type { Preset } from './schema';

/**
 * Default model presets for different providers.
 * Users can select a preset or define custom ones in their config.
 *
 * Usage in everything-opencode.json:
 * {
 *   "preset": "anthropic",  // Use this preset
 *   "presets": { ... },     // Optional: define custom presets
 *   "agents": { ... }       // Optional: override specific agents
 * }
 */

// Anthropic direct API (pure - all anthropic models)
export const PRESET_ANTHROPIC: Preset = {
  'EO-orchestrator': { model: 'anthropic/claude-opus-4-5-20251101' },
  'EO-planner': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-architect': { model: 'anthropic/claude-opus-4-5-20251101' },
  'EO-fixer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-tdd-guide': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-code-reviewer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-security-reviewer': { model: 'anthropic/claude-opus-4-5-20251101' },
  'EO-build-error-resolver': {
    model: 'anthropic/claude-sonnet-4-5-20250929',
  },
  'EO-e2e-runner': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-refactor-cleaner': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-doc-updater': { model: 'anthropic/claude-haiku-4-5-20251001' },
  'EO-database-reviewer': {
    model: 'anthropic/claude-sonnet-4-5-20250929',
  },
  'EO-go-reviewer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-go-build-resolver': {
    model: 'anthropic/claude-sonnet-4-5-20250929',
  },
  'EO-designer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'EO-multimodal-looker': {
    model: 'anthropic/claude-sonnet-4-5-20250929',
  },
};

// AWS Bedrock (pure - all bedrock models)
export const PRESET_BEDROCK: Preset = {
  'EO-orchestrator': {
    model: 'amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0',
  },
  'EO-planner': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-architect': {
    model: 'amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0',
  },
  'EO-fixer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-tdd-guide': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-code-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-security-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0',
  },
  'EO-build-error-resolver': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-e2e-runner': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-refactor-cleaner': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-doc-updater': {
    model: 'amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0',
  },
  'EO-database-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-go-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-go-build-resolver': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-designer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'EO-multimodal-looker': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
};

// GitHub Copilot (pure - all github-copilot models)
export const PRESET_GITHUB_COPILOT: Preset = {
  'EO-orchestrator': { model: 'github-copilot/claude-opus-4.5' },
  'EO-planner': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-architect': { model: 'github-copilot/claude-opus-4.5' },
  'EO-fixer': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-tdd-guide': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-code-reviewer': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-security-reviewer': { model: 'github-copilot/claude-opus-4.5' },
  'EO-build-error-resolver': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-e2e-runner': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-refactor-cleaner': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-doc-updater': { model: 'github-copilot/claude-haiku-4.5' },
  'EO-database-reviewer': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-go-reviewer': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-go-build-resolver': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-designer': { model: 'github-copilot/claude-sonnet-4.5' },
  'EO-multimodal-looker': { model: 'github-copilot/claude-sonnet-4.5' },
};

// OpenAI (pure - all openai models)
export const PRESET_OPENAI: Preset = {
  'EO-orchestrator': { model: 'openai/o3' },
  'EO-planner': { model: 'openai/gpt-4o' },
  'EO-architect': { model: 'openai/o3' },
  'EO-fixer': { model: 'openai/gpt-4o' },
  'EO-tdd-guide': { model: 'openai/gpt-4o' },
  'EO-code-reviewer': { model: 'openai/gpt-4o' },
  'EO-security-reviewer': { model: 'openai/o3' },
  'EO-build-error-resolver': { model: 'openai/gpt-4o' },
  'EO-e2e-runner': { model: 'openai/gpt-4o' },
  'EO-refactor-cleaner': { model: 'openai/gpt-4o' },
  'EO-doc-updater': { model: 'openai/gpt-4o-mini' },
  'EO-database-reviewer': { model: 'openai/gpt-4o' },
  'EO-go-reviewer': { model: 'openai/gpt-4o' },
  'EO-go-build-resolver': { model: 'openai/gpt-4o' },
  'EO-designer': { model: 'openai/gpt-4o' },
  'EO-multimodal-looker': { model: 'openai/gpt-4o' },
};

// Google (pure - all google models)
export const PRESET_GOOGLE: Preset = {
  'EO-orchestrator': { model: 'google/gemini-3-pro-high' },
  'EO-planner': { model: 'google/gemini-3-pro-high' },
  'EO-architect': { model: 'google/gemini-3-pro-high' },
  'EO-fixer': { model: 'google/gemini-3-flash' },
  'EO-tdd-guide': { model: 'google/gemini-3-pro-high' },
  'EO-code-reviewer': { model: 'google/gemini-3-pro-high' },
  'EO-security-reviewer': { model: 'google/gemini-3-pro-high' },
  'EO-build-error-resolver': { model: 'google/gemini-3-flash' },
  'EO-e2e-runner': { model: 'google/gemini-3-flash' },
  'EO-refactor-cleaner': { model: 'google/gemini-3-flash' },
  'EO-doc-updater': { model: 'google/gemini-3-flash' },
  'EO-database-reviewer': { model: 'google/gemini-3-pro-high' },
  'EO-go-reviewer': { model: 'google/gemini-3-pro-high' },
  'EO-go-build-resolver': { model: 'google/gemini-3-flash' },
  'EO-designer': { model: 'google/gemini-3-pro-high' },
  'EO-multimodal-looker': { model: 'google/gemini-3-flash' },
};

// All built-in presets
export const DEFAULT_PRESETS: Record<string, Preset> = {
  anthropic: PRESET_ANTHROPIC,
  bedrock: PRESET_BEDROCK,
  'github-copilot': PRESET_GITHUB_COPILOT,
  openai: PRESET_OPENAI,
  google: PRESET_GOOGLE,
};

// Default preset when none specified
export const DEFAULT_PRESET_NAME = 'github-copilot';
