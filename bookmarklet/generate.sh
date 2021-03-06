#!/bin/sh
#get current dir
DIR=`dirname "$0"`; SCRIPT_PATH=`eval "cd \"$SCRIPT_PATH\" && pwd"`
srcdir=`dirname "$DIR"`/src;
# rm comments and make into one liner. we don't use uglifyjs because right
# now extension size is relatively minimal, so there's no real tradeoff to
# wanting it to be transparent even to people who aren't going to read
# the build process in the repo that there's no intent to sneak anything in.
original="`sed -r 's/^ *\/\/.*$//g' $srcdir/ChatEnhancer.js | tr '\n' ' '`"

#shim in the actual js file into the function param
echo "function() { $original }"
