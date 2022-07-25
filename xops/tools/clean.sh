#!/bin/bash

rm -rf ./node_modules &
rm -rf ./dist &
wait

yarn install --cwd ./ &
wait

