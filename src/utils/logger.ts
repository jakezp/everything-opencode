import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

// Use user-specific log file with secure permissions
const logFile = path.join(
  os.tmpdir(),
  `opencode-${process.getuid?.() ?? 'default'}.log`,
);

/**
 * Safely stringify data, handling circular references and long strings.
 */
function safeStringify(data: unknown): string {
  try {
    const str = JSON.stringify(data);
    // Truncate if too long
    return str.length > 2000 ? `${str.substring(0, 2000)}...` : str;
  } catch {
    return String(data);
  }
}

export function log(message: string, data?: unknown): void {
  try {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${safeStringify(data)}` : '';
    const logEntry = `[${timestamp}] ${message}${dataStr}\n`;

    // Open file with secure permissions (user-only read/write)
    const fd = fs.openSync(logFile, 'a', 0o600);
    fs.writeSync(fd, logEntry);
    fs.closeSync(fd);
  } catch {
    // Silently ignore logging errors
  }
}
