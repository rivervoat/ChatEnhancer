#!/bin/bash
original="`sed -r 's/^ *\/\/.*$//g' ChatEnhancer.js | tr '\n' ' '`"
m4 -D the_original="$original" bookmarklet.js.m4 > ../bookmarklet.js
