#!/usr/bin/env node

import yargs from 'yargs';
import * as commandGetData from './commands/getData/index.js';
import * as saveOriginalNameToComment from './commands/saveOriginalNameToComment/index.js';
import * as renameToDate from './commands/renameToDate/index.js';
import * as groupLivePhotos from './commands/groupLivePhotos/index.js';
import * as removeFullDuplicates from './commands/removeFullDuplicates/index.js';
import * as findSimilar from './commands/findSimilar/index.js';
import * as removeCopyNames from './commands/removeCopyNames/index.js';
import * as lowerExt from './commands/lowerExt/index.js';
import * as findGroups from './commands/findGroups/index.js';

yargs(process.argv.slice(2))
    .command(commandGetData)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(saveOriginalNameToComment)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(renameToDate)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(groupLivePhotos)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(removeFullDuplicates)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(findSimilar)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(removeCopyNames)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(lowerExt)
    // @ts-expect-error Argument of type ...index is not assignable to parameter of type 'CommandModule<{}, any>'.
    .command(findGroups)
    .demandCommand(1, 'Select a command.')
    .parse();
