#!/bin/sh
# get current dir
# really should replace all this bash shell stuff with a build system
# that could work more easily on Windows without cygwin

DIR=`dirname "$0"`; SCRIPT_PATH=`eval "cd \"$SCRIPT_PATH\" && pwd"`

mkdir -p ${DIR}/out_standalone

tgt_bookmarklet() {
    ${DIR}/bookmarklet/generate.sh > ${DIR}/out_standalone/bookmarklet.js
}

tgt_chrome() {
    chrome=0
    if [ ! "$CHROME_KEY" ]; then
        echo "notice: you did not provide CHROME_KEY path for providing updates
one will be generated for you."
        # not an error, or even a warning, most people unfamiliar with the
        # project will be building standalone, not for distrib.
    elif [ ! -f "$CHROME_KEY" ]; then
        echo "error, you provided a CHROME_KEY path but it wasn't an extant file
    skipping chrome"
        return 1
    fi
    keypath=`readlink -f $CHROME_KEY`
    chromium --pack-extension=${DIR}/chrome --pack-extension-key=$CHROME_KEY
    mv ${DIR}/chrome.crx ${DIR}/out_standalone/ChatEnhancerChrome.crx
    return 0
}

tgt_all() {
    tgt_bookmarklet
    tgt_chrome
}

tgt_clean() {
    if [ -e ${DIR}/out_standalone ]; then
        rm -r ${DIR}/out_standalone
    fi
}

if [ ! "$1" ]; then
    tgt_all
else
    for x in $@; do tgt_$x; done
fi
