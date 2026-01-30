/**
 * Compaction hooks for strategic optimization suggestions
 * Tracks edit count and suggests running /compact after threshold
 */

export interface CompactionConfig {
  /** Edit count threshold before suggesting compaction (default: 20) */
  threshold?: number;
  /** Callback when compaction is suggested */
  onSuggestion?: (editCount: number) => void;
}

interface CompactionState {
  editCount: number;
}

export function createCompactionHooks(config?: CompactionConfig) {
  const threshold = config?.threshold ?? 20;
  const state: CompactionState = {
    editCount: 0,
  };

  return {
    /**
     * Track an edit and suggest compaction if threshold is reached
     */
    trackEdit(): boolean {
      state.editCount++;

      if (state.editCount % threshold === 0) {
        config?.onSuggestion?.(state.editCount);
        return true; // Suggestion triggered
      }

      return false;
    },

    /**
     * Reset edit counter after compaction
     */
    resetEditCount(): void {
      state.editCount = 0;
    },

    /**
     * Get current edit count
     */
    getEditCount(): number {
      return state.editCount;
    },

    /**
     * Get edits until next suggestion
     */
    getEditsUntilSuggestion(): number {
      return threshold - (state.editCount % threshold);
    },
  };
}

export type CompactionHooks = ReturnType<typeof createCompactionHooks>;
