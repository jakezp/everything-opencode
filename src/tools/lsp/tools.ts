// LSP Tools - 4 essential tools only

import { type ToolDefinition, tool } from '@opencode-ai/plugin/tool';
import { DEFAULT_MAX_DIAGNOSTICS, DEFAULT_MAX_REFERENCES } from './constants';
import type {
  Diagnostic,
  Location,
  LocationLink,
  WorkspaceEdit,
} from './types';
import {
  applyWorkspaceEdit,
  filterDiagnosticsBySeverity,
  formatApplyResult,
  formatDiagnostic,
  formatLocation,
  withLspClient,
} from './utils';

const formatError = (e: unknown): string =>
  `Error: ${e instanceof Error ? e.message : String(e)}`;

export const lsp_goto_definition: ToolDefinition = tool({
  description: 'Jump to symbol definition. Find WHERE something is defined.',
  args: {
    filePath: tool.schema.string().describe('Absolute path to the file'),
    line: tool.schema.number().min(1).describe('1-based line number'),
    character: tool.schema.number().min(0).describe('0-based character offset'),
  },
  execute: async (args) => {
    try {
      const result = await withLspClient(args.filePath, async (client) => {
        return (await client.definition(
          args.filePath,
          args.line,
          args.character,
        )) as Location | Location[] | LocationLink[] | null;
      });

      if (!result) {
        return 'No definition found';
      }

      const locations = Array.isArray(result) ? result : [result];
      if (locations.length === 0) {
        return 'No definition found';
      }

      return locations.map(formatLocation).join('\n');
    } catch (e) {
      return formatError(e);
    }
  },
});

export const lsp_find_references: ToolDefinition = tool({
  description:
    'Find ALL usages/references of a symbol across the entire workspace.',
  args: {
    filePath: tool.schema.string().describe('Absolute path to the file'),
    line: tool.schema.number().min(1).describe('1-based line number'),
    character: tool.schema.number().min(0).describe('0-based character offset'),
    includeDeclaration: tool.schema
      .boolean()
      .optional()
      .describe('Include the declaration itself'),
  },
  execute: async (args) => {
    try {
      const result = await withLspClient(args.filePath, async (client) => {
        return (await client.references(
          args.filePath,
          args.line,
          args.character,
          args.includeDeclaration ?? true,
        )) as Location[] | null;
      });

      if (!result || result.length === 0) {
        return 'No references found';
      }

      const total = result.length;
      const truncated = total > DEFAULT_MAX_REFERENCES;
      const limited = truncated
        ? result.slice(0, DEFAULT_MAX_REFERENCES)
        : result;
      const lines = limited.map(formatLocation);
      if (truncated) {
        lines.unshift(
          `Found ${total} references (showing first ${DEFAULT_MAX_REFERENCES}):`,
        );
      }
      return lines.join('\n');
    } catch (e) {
      return formatError(e);
    }
  },
});

export const lsp_diagnostics: ToolDefinition = tool({
  description:
    'Get errors, warnings, hints from language server BEFORE running build.',
  args: {
    filePath: tool.schema.string().describe('Absolute path to the file'),
    severity: tool.schema
      .enum(['error', 'warning', 'information', 'hint', 'all'])
      .optional()
      .describe('Filter by severity level'),
  },
  execute: async (args) => {
    try {
      const result = await withLspClient(args.filePath, async (client) => {
        return (await client.diagnostics(args.filePath)) as
          | { items?: Diagnostic[] }
          | Diagnostic[]
          | null;
      });

      let diagnostics: Diagnostic[] = [];
      if (result) {
        if (Array.isArray(result)) {
          diagnostics = result;
        } else if (result.items) {
          diagnostics = result.items;
        }
      }

      diagnostics = filterDiagnosticsBySeverity(diagnostics, args.severity);

      if (diagnostics.length === 0) {
        return 'No diagnostics found';
      }

      const total = diagnostics.length;
      const truncated = total > DEFAULT_MAX_DIAGNOSTICS;
      const limited = truncated
        ? diagnostics.slice(0, DEFAULT_MAX_DIAGNOSTICS)
        : diagnostics;
      const lines = limited.map(formatDiagnostic);
      if (truncated) {
        lines.unshift(
          `Found ${total} diagnostics (showing first ${DEFAULT_MAX_DIAGNOSTICS}):`,
        );
      }
      return lines.join('\n');
    } catch (e) {
      return formatError(e);
    }
  },
});

export const lsp_rename: ToolDefinition = tool({
  description:
    'Rename symbol across entire workspace. APPLIES changes to all files.',
  args: {
    filePath: tool.schema.string().describe('Absolute path to the file'),
    line: tool.schema.number().min(1).describe('1-based line number'),
    character: tool.schema.number().min(0).describe('0-based character offset'),
    newName: tool.schema.string().describe('New symbol name'),
  },
  execute: async (args) => {
    try {
      const edit = await withLspClient(args.filePath, async (client) => {
        return (await client.rename(
          args.filePath,
          args.line,
          args.character,
          args.newName,
        )) as WorkspaceEdit | null;
      });
      const result = applyWorkspaceEdit(edit);
      return formatApplyResult(result);
    } catch (e) {
      return formatError(e);
    }
  },
});
