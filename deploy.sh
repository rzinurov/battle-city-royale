#!/bin/sh
sh ./build.sh
git add docs
git commit -m 'Publish dist'
git push origin main
