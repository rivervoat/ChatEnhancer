#!/bin/bash
m4 -D the_original="`cat ChatEnhancer.js`" bookmarklet.js.m4 | sed -r 's/\/\/.*$//g' | tr '\n' ' ' > ../bookmarklet.js
