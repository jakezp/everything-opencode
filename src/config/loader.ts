import * as fs from 'node:fs';
import * as path from 'node:path';
import { log } from '../utils/logger';
import { DEFAULT_PRESETS, DEFAULT_PRESET_NAME } from './presets';
import { type PluginConfig, PluginConfigSchema, type Preset } from './schema';

const CONFIG_FILE_NAME = 'everything-opencode.json';

/**
 * Get the user's configuration directory following XDG Base Directory specification.
 */
function getUserConfigDir(): string {
  return (
    process.env.XDG_CONFIG_HOME || path.join(process.env.HOME || '', '.config')
  );
}

/**
 * Load and validate plugin configuration from a specific file path.
 */
function loadConfigFromPath(configPath: string): PluginConfig | null {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const rawConfig = JSON.parse(content);
    const result = PluginConfigSchema.safeParse(rawConfig);

    if (!result.success) {
      log('[config] Invalid config file', {
        path: configPath,
        errors: result.error.errors,
      });
      return null;
    }

    log('[config] Loaded config', { path: configPath });
    return result.data;
  } catch (error) {
    // File doesn't exist - this is fine
    if (
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code !== 'ENOENT'
    ) {
      log('[config] Error reading config', {
        path: configPath,
        error: String(error),
      });
    }
    return null;
  }
}

/**
 * Deep merge two objects. Override values take precedence.
 * For nested objects, merges recursively. For arrays and primitives, override replaces base.
 */
function deepMerge<T extends Record<string, unknown>>(
  base?: T,
  override?: T,
): T | undefined {
  if (!base) return override;
  if (!override) return base;

  const result = { ...base } as T;
  for (const key of Object.keys(override) as (keyof T)[]) {
    const baseVal = base[key];
    const overrideVal = override[key];

    if (
      typeof baseVal === 'object' &&
      baseVal !== null &&
      typeof overrideVal === 'object' &&
      overrideVal !== null &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overrideVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>,
      ) as T[keyof T];
    } else {
      result[key] = overrideVal;
    }
  }
  return result;
}

/**
 * Load plugin configuration from user and project config files.
 *
 * Configuration priority (highest to lowest):
 * 1. Environment variable: EVERYTHING_OPENCODE_PRESET
 * 2. Project config: <directory>/.opencode/everything-opencode.json
 * 3. User config: ~/.config/opencode/everything-opencode.json
 * 4. Built-in defaults
 *
 * @param projectDir - Project directory to search for .opencode config
 * @returns Merged and resolved plugin configuration
 */
export function loadPluginConfig(projectDir: string): PluginConfig {
  const userConfigPath = path.join(
    getUserConfigDir(),
    'opencode',
    CONFIG_FILE_NAME,
  );
  const projectConfigPath = path.join(
    projectDir,
    '.opencode',
    CONFIG_FILE_NAME,
  );

  // Load user config first (lowest priority)
  let config: PluginConfig = loadConfigFromPath(userConfigPath) ?? {};

  // Merge project config (higher priority)
  const projectConfig = loadConfigFromPath(projectConfigPath);
  if (projectConfig) {
    config = {
      ...config,
      ...projectConfig,
      agents: deepMerge(config.agents, projectConfig.agents),
      tmux: deepMerge(config.tmux, projectConfig.tmux),
      // User presets merge with project presets
      presets: deepMerge(config.presets, projectConfig.presets),
    };
  }

  // Environment variable override for preset (highest priority)
  const envPreset = process.env.EVERYTHING_OPENCODE_PRESET;
  if (envPreset) {
    config.preset = envPreset;
    log('[config] Using preset from environment', { preset: envPreset });
  }

  // Resolve the active preset
  config = resolvePreset(config);

  return config;
}

/**
 * Resolve the preset configuration and merge with agents.
 *
 * Resolution order:
 * 1. Check user-defined presets (config.presets)
 * 2. Fall back to built-in presets (DEFAULT_PRESETS)
 * 3. Merge preset agents with root agents (root overrides preset)
 */
function resolvePreset(config: PluginConfig): PluginConfig {
  const presetName = config.preset || DEFAULT_PRESET_NAME;

  // Look for preset in user config first, then built-in presets
  let preset: Preset | undefined =
    config.presets?.[presetName] ?? DEFAULT_PRESETS[presetName];

  if (!preset) {
    // Preset not found - warn and list available
    const userPresets = Object.keys(config.presets || {});
    const builtInPresets = Object.keys(DEFAULT_PRESETS);
    const available = [...new Set([...userPresets, ...builtInPresets])];

    log('[config] Preset not found, using default', {
      requested: presetName,
      available: available.join(', '),
      fallback: DEFAULT_PRESET_NAME,
    });

    preset = DEFAULT_PRESETS[DEFAULT_PRESET_NAME];
  } else {
    log('[config] Using preset', { preset: presetName });
  }

  // Merge: preset provides base, root agents override
  config.agents = deepMerge(preset, config.agents);

  return config;
}
