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
  orchestrator: { model: 'anthropic/claude-opus-4-5-20251101' },
  planner: { model: 'anthropic/claude-sonnet-4-5-20250929' },
  architect: { model: 'anthropic/claude-opus-4-5-20251101' },
  fixer: { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'tdd-guide': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'code-reviewer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'security-reviewer': { model: 'anthropic/claude-opus-4-5-20251101' },
  'build-error-resolver': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'e2e-runner': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'refactor-cleaner': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'doc-updater': { model: 'anthropic/claude-haiku-4-5-20251001' },
  'database-reviewer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'go-reviewer': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'go-build-resolver': { model: 'anthropic/claude-sonnet-4-5-20250929' },
  designer: { model: 'anthropic/claude-sonnet-4-5-20250929' },
  'multimodal-looker': { model: 'anthropic/claude-sonnet-4-5-20250929' },
};

// AWS Bedrock (pure - all bedrock models)
export const PRESET_BEDROCK: Preset = {
  orchestrator: {
    model: 'amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0',
  },
  planner: {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  architect: {
    model: 'amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0',
  },
  fixer: { model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0' },
  'tdd-guide': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'code-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'security-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0',
  },
  'build-error-resolver': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'e2e-runner': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'refactor-cleaner': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'doc-updater': {
    model: 'amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0',
  },
  'database-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'go-reviewer': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'go-build-resolver': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  designer: {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
  'multimodal-looker': {
    model: 'amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0',
  },
};

// GitHub Copilot (pure - all github-copilot models)
export const PRESET_GITHUB_COPILOT: Preset = {
  orchestrator: { model: 'github-copilot/claude-opus-4.5' },
  planner: { model: 'github-copilot/claude-sonnet-4.5' },
  architect: { model: 'github-copilot/claude-opus-4.5' },
  fixer: { model: 'github-copilot/claude-sonnet-4.5' },
  'tdd-guide': { model: 'github-copilot/claude-sonnet-4.5' },
  'code-reviewer': { model: 'github-copilot/claude-sonnet-4.5' },
  'security-reviewer': { model: 'github-copilot/claude-opus-4.5' },
  'build-error-resolver': { model: 'github-copilot/claude-sonnet-4.5' },
  'e2e-runner': { model: 'github-copilot/claude-sonnet-4.5' },
  'refactor-cleaner': { model: 'github-copilot/claude-sonnet-4.5' },
  'doc-updater': { model: 'github-copilot/claude-haiku-4.5' },
  'database-reviewer': { model: 'github-copilot/claude-sonnet-4.5' },
  'go-reviewer': { model: 'github-copilot/claude-sonnet-4.5' },
  'go-build-resolver': { model: 'github-copilot/claude-sonnet-4.5' },
  designer: { model: 'github-copilot/claude-sonnet-4.5' },
  'multimodal-looker': { model: 'github-copilot/claude-sonnet-4.5' },
};

// OpenAI (pure - all openai models)
export const PRESET_OPENAI: Preset = {
  orchestrator: { model: 'openai/o3' },
  planner: { model: 'openai/gpt-4o' },
  architect: { model: 'openai/o3' },
  fixer: { model: 'openai/gpt-4o' },
  'tdd-guide': { model: 'openai/gpt-4o' },
  'code-reviewer': { model: 'openai/gpt-4o' },
  'security-reviewer': { model: 'openai/o3' },
  'build-error-resolver': { model: 'openai/gpt-4o' },
  'e2e-runner': { model: 'openai/gpt-4o' },
  'refactor-cleaner': { model: 'openai/gpt-4o' },
  'doc-updater': { model: 'openai/gpt-4o-mini' },
  'database-reviewer': { model: 'openai/gpt-4o' },
  'go-reviewer': { model: 'openai/gpt-4o' },
  'go-build-resolver': { model: 'openai/gpt-4o' },
  designer: { model: 'openai/gpt-4o' },
  'multimodal-looker': { model: 'openai/gpt-4o' },
};

// Google (pure - all google models)
export const PRESET_GOOGLE: Preset = {
  orchestrator: { model: 'google/gemini-3-pro-high' },
  planner: { model: 'google/gemini-3-pro-high' },
  architect: { model: 'google/gemini-3-pro-high' },
  fixer: { model: 'google/gemini-3-flash' },
  'tdd-guide': { model: 'google/gemini-3-pro-high' },
  'code-reviewer': { model: 'google/gemini-3-pro-high' },
  'security-reviewer': { model: 'google/gemini-3-pro-high' },
  'build-error-resolver': { model: 'google/gemini-3-flash' },
  'e2e-runner': { model: 'google/gemini-3-flash' },
  'refactor-cleaner': { model: 'google/gemini-3-flash' },
  'doc-updater': { model: 'google/gemini-3-flash' },
  'database-reviewer': { model: 'google/gemini-3-pro-high' },
  'go-reviewer': { model: 'google/gemini-3-pro-high' },
  'go-build-resolver': { model: 'google/gemini-3-flash' },
  designer: { model: 'google/gemini-3-pro-high' },
  'multimodal-looker': { model: 'google/gemini-3-flash' },
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
