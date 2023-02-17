#!/usr/bin/env node

import yargs from 'yargs';
import * as commandGetData from './commands/getData/index.js';
import * as saveOriginalNameToComment from './commands/saveOriginalNameToComment/index.js';
import * as renameToDate from './commands/renameToDate/index.js';

yargs(process.argv.slice(2))
    .command(commandGetData)
    .command(saveOriginalNameToComment)
    .command(renameToDate)
    .demandCommand(1, 'Select a command.')
    .parse();
