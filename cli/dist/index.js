#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
const program = new Command();
program
    .name('bahrawy')
    .description('Add Bahrawy components to your project — copy, paste, ship.')
    .version('0.1.0');
program
    .command('add')
    .description('Add one or more Bahrawy components to your project')
    .argument('[components...]', 'component names to install')
    .option('-f, --force', 'overwrite existing files', false)
    .option('--cwd <path>', 'working directory (default: current)', process.cwd())
    .action(async (components, opts) => {
    await addCommand(components, opts);
});
program
    .command('list')
    .description('List all available Bahrawy components')
    .option('--cwd <path>', 'working directory (default: current)', process.cwd())
    .action((opts) => {
    listCommand(opts);
});
program.parse();
//# sourceMappingURL=index.js.map