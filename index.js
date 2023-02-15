#!/usr/bin/env node

import yargs from 'yargs/yargs';
import * as commandGetData from './src/commands/getData/index.js';
import * as saveOriginalNameToComment from './src/commands/saveOriginalNameToComment/index.js';

yargs(process.argv.slice(2))
    .command(commandGetData.command, commandGetData.description, commandGetData.builder, commandGetData.handler)
    .command(saveOriginalNameToComment.command, saveOriginalNameToComment.description, saveOriginalNameToComment.builder, saveOriginalNameToComment.handler)
    .demandCommand(1, 'Select a command.')
    .parse();
