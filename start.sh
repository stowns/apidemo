#!/bin/sh
node ./api/src/main.js &
node ./service_1/main.js &
node ./service_2/main.js 