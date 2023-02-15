#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import main from './src/index.js';

const argv = yargs(hideBin(process.argv)).argv;

const path = argv._[0];

if (!path) {
    console.error('Please, set path to folder.');
    process.exit(1);
}

main(path);
