#!/usr/bin/env bash

FOLDER=${FOLDER:-'/tmp'}

echo "Start process: $FOLDER"

#echo "1) Save original names to comment":
#npm run cli saveOriginalNameToComment $FOLDER

#echo "2) Save raw data":
npm run cli buildData $FOLDER

echo "3) Clear file names from copies number":
npm run cli removeCopyNames $FOLDER

echo "4) Rename files by meta datetime"
npm run cli renameToDate $FOLDER

echo "5) Lower extensions case"
npm run cli lowerExt $FOLDER

echo "6) Group live photos":
npm run cli groupLivePhotos $FOLDER
