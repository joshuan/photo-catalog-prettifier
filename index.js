#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;

const path = argv._[0];

if (!path) {
    console.error('Please, set path to folder.');
    process.exit(1);
}

const main = require('./src');

main(path);
