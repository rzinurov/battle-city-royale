#!/bin/sh
/bin/rm -rf ./docs/*
npm run build
cp -a ./dist/* ./docs/
