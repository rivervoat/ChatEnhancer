#!/bin/bash
#get current dir
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mkdir -p out_standalone

tgt_bookmarklet() {
    ./bookmarklet/./generate.sh > out_standalone/bookmarklet.js
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
    chromium --pack-extension=${DIR}/chrome --pack-extension-key=$CHROME_KEY
    mv chrome.crx out_standalone/ChatEnhancerChrome.crx
    return 0
}

tgt_all() {
    tgt_bookmarklet
    tgt_chrome
}

if [ ! "$1" ]; then
    tgt_all
else
    for x in $@; do $x; done
fi
