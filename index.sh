#!/usr/bin/env bash

FOLDER=${FOLDER:-'/tmp'}

echo "Start process: $FOLDER"

#echo "1) Save original names to comment":
#node . saveOriginalNameToComment $FOLDER
#
#echo "2) Save raw data":
#node . getData $FOLDER

echo "3) Rename files by meta datetime":
node . renameToDate $FOLDER --defaultPhotoOffset=+03:00

echo "4) Group live photos":
node . groupLivePhotos $FOLDER
