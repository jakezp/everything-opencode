#!/usr/bin/env node
/**
 * everything-opencode CLI
 *
 * Commands:
 * - install: Copy agents, skills, commands, rules to user config
 * - version: Show version
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of this script at runtime (not build time)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI is at dist/cli/index.js, so go up two levels to package root
const PLUGIN_ROOT = path.resolve(__dirname, '..', '..');

// OpenCode config directory - always under opencode/ subdirectory
const CONFIG_BASE =
  process.env.XDG_CONFIG_HOME || path.join(process.env.HOME || '', '.config');
const USER_CONFIG_DIR = path.join(CONFIG_BASE, 'opencode');

const COMPONENTS = ['agents', 'commands', 'skills', 'rules', 'contexts'];

const CONFIG_FILE_NAME = 'everything-opencode.json';

// Sample config with comments explaining options
const SAMPLE_CONFIG = {
  // Choose your provider preset: "anthropic", "bedrock", "github-copilot", "openai", "gemini"
  preset: 'anthropic',

  // Per-agent overrides (optional)
  // agents: {
  //   "doc-updater": { "model": "anthropic/claude-haiku-3-5" },
  //   "security-reviewer": { "model": "anthropic/claude-opus-4-5" }
  // },

  // Tmux integration (optional)
  // tmux: {
  //   enabled: true,
  //   layout: "main-vertical"
  // }
};

async function install() {
  console.log('Installing everything-opencode components...\n');

  // Ensure config directory exists
  fs.mkdirSync(USER_CONFIG_DIR, { recursive: true });

  // Install components
  for (const component of COMPONENTS) {
    const source = path.join(PLUGIN_ROOT, component);
    const target = path.join(USER_CONFIG_DIR, component);

    if (!fs.existsSync(source)) {
      console.log(`  ⏭️  Skipping ${component} (not found in plugin)`);
      continue;
    }

    // Create target directory
    fs.mkdirSync(target, { recursive: true });

    // Copy files
    const items = fs.readdirSync(source);
    let copied = 0;

    for (const item of items) {
      const srcPath = path.join(source, item);
      const dstPath = path.join(target, item);

      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        // Copy directory recursively
        copyDirRecursive(srcPath, dstPath);
        copied++;
      } else {
        // Copy file
        fs.copyFileSync(srcPath, dstPath);
        copied++;
      }
    }

    console.log(`  ✅ Installed ${copied} ${component}`);
  }

  // Create sample config if it doesn't exist
  const configPath = path.join(USER_CONFIG_DIR, CONFIG_FILE_NAME);
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(SAMPLE_CONFIG, null, 2));
    console.log(`  ✅ Created sample config: ${CONFIG_FILE_NAME}`);
  } else {
    console.log(`  ⏭️  Config exists: ${CONFIG_FILE_NAME} (not overwritten)`);
  }

  console.log('\n✨ Installation complete!');
  console.log(`\nComponents installed to: ${USER_CONFIG_DIR}`);
  console.log(`\nConfiguration file: ${configPath}`);
  console.log('\nTo change providers, edit the "preset" value:');
  console.log(
    '  "anthropic" | "bedrock" | "github-copilot" | "openai" | "gemini"',
  );
  console.log('\nTo use the plugin, add to your opencode.json:');
  console.log('  { "plugin": ["everything-opencode"] }');
}

function copyDirRecursive(src: string, dst: string) {
  fs.mkdirSync(dst, { recursive: true });
  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const dstPath = path.join(dst, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function showVersion() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(PLUGIN_ROOT, 'package.json'), 'utf-8'),
  );
  console.log(`everything-opencode v${pkg.version}`);
}

function showHelp() {
  console.log(`
everything-opencode - Complete OpenCode configuration

Usage:
  everything-opencode <command>

Commands:
  install   Copy agents, skills, commands, rules to ~/.config/opencode/
  version   Show version
  help      Show this help

Examples:
  everything-opencode install
  everything-opencode version
`);
}

// Main
const command = process.argv[2];

switch (command) {
  case 'install':
    install();
    break;
  case 'version':
  case '-v':
  case '--version':
    showVersion();
    break;
  case 'help':
  case '-h':
  case '--help':
  case undefined:
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
