/**
 * Main hooks index
 * Exports all hooks from subdirectories
 */

export {
  type PreToolUseConfig,
  type PreToolUseHooks,
  createPreToolUseHooks,
} from './pre-tool-use';
export {
  type PostToolUseConfig,
  type PostToolUseHooks,
  createPostToolUseHooks,
} from './post-tool-use';
export {
  type SessionLifecycleConfig,
  type SessionLifecycleHooks,
  createSessionLifecycleHooks,
} from './session-lifecycle';
export {
  type CompactionConfig,
  type CompactionHooks,
  createCompactionHooks,
} from './compaction';

/**
 * Configuration for all hooks
 */
export interface HookConfig {
  preToolUse?: import('./pre-tool-use').PreToolUseConfig;
  postToolUse?: import('./post-tool-use').PostToolUseConfig;
  sessionLifecycle?: import('./session-lifecycle').SessionLifecycleConfig;
  compaction?: import('./compaction').CompactionConfig;
}
