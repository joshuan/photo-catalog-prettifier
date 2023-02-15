#!/usr/bin/env node

import yargs from 'yargs/yargs';
import * as commandGetData from './src/commands/getData.js';

yargs(process.argv.slice(2))
    .command(commandGetData.command, commandGetData.description, commandGetData.builder, commandGetData.handler)
    .demandCommand(1, 'Select a command.')
    .parse();
