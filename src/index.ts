#!/usr/bin/env node

import yargs from 'yargs';
import * as commandGetData from './commands/getData';
import * as saveOriginalNameToComment from './commands/saveOriginalNameToComment';

yargs(process.argv.slice(2))
    .command(commandGetData.command, commandGetData.description, commandGetData.builder, commandGetData.handler)
    .command(saveOriginalNameToComment.command, saveOriginalNameToComment.description, saveOriginalNameToComment.builder, saveOriginalNameToComment.handler)
    .demandCommand(1, 'Select a command.')
    .parse();
